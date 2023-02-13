import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionEntityService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { TransportService } from '@nest-datum/transport';
import {
	ErrorException,
	WarningException,
	NotFoundException,
} from '@nest-datum-common/exceptions';
import {
	encryptPassword,
	generateVerifyKey,
	generateTokens,
	checkPassword,
	generateAccessToken,
} from '@nest-datum/jwt';
import {
	arrFilled as utilsCheckArrFilled,
	objFilled as utilsCheckObjFilled,
} from '@nest-datum-utils/check';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';

@Injectable()
export class UserService extends OptionEntityService {
	protected entityName = 'user';
	protected entityConstructor = User;
	protected entityOptionConstructor = UserUserOption;
	protected entityId = 'userId';

	constructor(
		@InjectRepository(User) protected entityRepository: Repository<User>,
		@InjectRepository(UserUserOption) protected entityOptionRepository: Repository<UserUserOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
		protected transportService: TransportService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			roleId: true,
			userStatusId: true,
			login: true,
			email: true,
			isDeleted: true,
			isNotDelete: true,
			emailVerifyKey: true,
			emailVerifiedAt: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			...super.manyGetQueryColumns(customColumns),
			login: true,
			email: true,
		});
	}

	async register(payload): Promise<any> {
		await this.createQueryRunnerManager();

		try {
			await this.startQueryRunnerManager();
			
			this.cacheService.clear([ this.entityName, 'many' ]);

			const firstname = payload['firstname'];
			const lastname = payload['lastname'];

			delete payload['firstname'];
			delete payload['lastname'];

			const data = {
				...payload,
				password: await encryptPassword(payload['password']),
				emailVerifyKey: await generateVerifyKey(payload['email']),
			};
			const output = await this.queryRunner.manager.save(Object.assign(new User(), data));

			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'sso-user-option-firstname',
				content: firstname,
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'sso-user-option-lastname',
				content: lastname,
			}));

			await this.transportService.send({ 
				name: process.env.SERVICE_MAIL,
				cmd: 'report.create',
			}, {
				letterId: 'mail-letter-base-registration', 
				email: data['email'],
				action: `Register new user "${data['email']}"`,
				reportStatusId: 'mail-report-status-send',
				content: JSON.stringify({
					...data,
					firstname,
					lastname,
				}),
				accessToken: generateAccessToken({
					id: process.env.USER_ID,
					roleId: process.env.USER_ADMIN_ROLE,
					email: process.env.USER_EMAIL,
				}, Date.now()),
			});
			await this.commitQueryRunnerManager();

			return {
				id: output['id'],
				login: output['id'],
			};
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw new ErrorException(err.message);
		}
		finally {
			await this.dropQueryRunnerManager();
		}
	}

	async verify(payload): Promise<any> {
		try {
			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one' ]);

			const user = await this.entityRepository.findOne({
				where: {
					emailVerifyKey: payload['verifyKey'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with email "${payload['email']}" not found.`);
			}
			if (user['emailVerifiedAt']) {
				throw new WarningException(`Current account already verified.`);
			}
			if ((Date.now() - user['createdAt'].getTime()) > 86400000) {
				throw new WarningException(`Key expired.`);
			}
			await this.entityRepository.save({ 
				...user, 
				emailVerifyKey: '',
				emailVerifiedAt: new Date(),
			});

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	async login(payload): Promise<any> {
		try {
			const user = await this.entityRepository.findOne({
				where: [
					{ email: payload['login'] },
					{ login: payload['login'] },
				],
				relations: {
					userUserOptions: {
						userOption: true,
					},
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`);
			}
			if (await checkPassword(payload['password'], user['password'])) {
				return await generateTokens(user);
			}
			throw new WarningException(`Wrong password specified.`);
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	async recovery(payload): Promise<any> {
		try {
			const user = await this.entityRepository.findOne({
				where: {
					email: payload['email'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`);
			}
			if (!user['emailVerifiedAt']) {
				throw new WarningException(`The current user has not activated an account.`);
			}
			const output = { 
				...user, 
				emailVerifyKey: await generateVerifyKey(payload['email']),
			};

			await this.entityRepository.save({
				...user,
				...output,
			});
			await this.transportService.send({ 
				name: process.env.SERVICE_MAIL,
				cmd: 'report.create',
			}, {
				letterId: 'mail-letter-base-recovery', 
				email: payload['email'],
				action: `Recovery access for "${payload['email']}"`,
				reportStatusId: 'mail-report-status-send',
				content: JSON.stringify({
					...output,
				}),
				accessToken: generateAccessToken({
					id: process.env.USER_ID,
					roleId: process.env.USER_ADMIN_ROLE,
					email: process.env.USER_EMAIL,
				}, Date.now()),
			});

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	async reset(payload): Promise<any> {
		try {
			const user = await this.entityRepository.findOne({
				where: {
					email: payload['email'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`);
			}
			if (!user['emailVerifiedAt']) {
				throw new WarningException(`Current account already verified.`);
			}
			if (user['emailVerifyKey'] !== payload['verifyKey']) {
				throw new WarningException(`Key not validated.`);
			}
			await this.entityRepository.save({
				...user,
				password: await encryptPassword(payload['password']),
				emailVerifyKey: '',
			});

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	async refresh(payload): Promise<any> {
		try {
			const user = await this.entityRepository.findOne({
				where: {
					id: payload['id'],
				},
				// relations: {
				// 	userUserOptions: {
				// 		userOption: true,
				// 	},
				// },
			});

			// if (!user 
			// 	|| !utilsCheckArrFilled(user['userUserOptions'])
			// 	|| !utilsCheckObjFilled(user['userUserOptions'][0]['userOption'])) {
			// 	throw new NotFoundException(`User with id "${payload['id']}" not found.`);
			// }
			return await generateTokens(user);
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	protected async createProperties(payload: object): Promise<any> {
		if (payload['password']) {
			payload['password'] = await encryptPassword(payload['password']);
		}
		return payload;
	}

	protected async updateProperties(payload: object): Promise<any> {
		if (payload['password']) {
			payload['password'] = await encryptPassword(payload['password']);
		}
		return payload;
	}
}
