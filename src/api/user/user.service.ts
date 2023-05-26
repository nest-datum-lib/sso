import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import {
	arrFilled as utilsCheckArrFilled,
	objFilled as utilsCheckObjFilled,
	strIdExists as utilsCheckStrIdExists,
} from '@nest-datum-utils/check';
import {
	FailureException,
	MethodNotAllowedException,
	NotFoundException,
} from '@nest-datum-common/exceptions';
import {
	encryptPassword,
	generateVerifyKey,
	generateTokens,
	checkPassword,
	generateAccessToken,
} from '@nest-datum-common/jwt';
import { TransportService } from '@nest-datum/transport';
import { MainService } from '@nest-datum/main';
import { CacheService } from '@nest-datum/cache';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';

@Injectable()
export class UserService extends MainService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryConstructor = User;
	protected readonly repositoryBindOptionConstructor = UserUserOption;
	protected readonly mainRelationColumnName: string = 'userId';
	protected readonly optionRelationColumnName: string = 'userOptionId';

	constructor(
		@InjectRepository(User) protected readonly repository: Repository<User>,
		@InjectRepository(UserUserOption) protected repositoryBindOption: Repository<UserUserOption>,
		protected readonly transport: TransportService,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
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

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
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
			login: true,
			email: true,
		});
	}

	async register(payload): Promise<any> {
		await this.createQueryRunnerManager();

		try {
			await this.startQueryRunnerManager();

			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });

			const firstname = payload['firstname'];
			const lastname = payload['lastname'];
			const position = payload['position'];
			const location = payload['location'];

			delete payload['firstname'];
			delete payload['lastname'];
			delete payload['position'];
			delete payload['location'];

			const data = {
				...payload,
				password: await encryptPassword(payload['password']),
				emailVerifyKey: await generateVerifyKey(payload['email']),
			};
			const output = await this.queryRunner.manager.save(Object.assign(new User(), data));

			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-firstname',
				content: firstname,
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-lastname',
				content: lastname,
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-avatar',
				content: '',
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-facebook',
				content: '',
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-linkedin',
				content: '',
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-site',
				content: '',
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-phone',
				content: '',
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-position',
				content: String(position ?? ''),
			}));
			await this.queryRunner.manager.save(Object.assign(new UserUserOption(), {
				userId: output['id'],
				userOptionId: 'happ-sso-user-option-location',
				content: String(location ?? ''),
			}));
			await this.transport.send({ 
				name: process.env.SERVICE_MAIL,
				cmd: 'report.create',
			}, {
				letterId: 'happ-mail-letter-base-registration', 
				email: data['email'],
				action: `Register new user "${data['email']}"`,
				reportStatusId: 'happ-mail-report-status-send',
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

			throw new FailureException(err.message);
		}
		finally {
			await this.dropQueryRunnerManager();
		}
	}

	async verify(payload): Promise<any> {
		const user = await this.repository.findOne({
			where: {
				emailVerifyKey: payload['verifyKey'],
			},
		});

		if (!user) {
			throw new NotFoundException(`User not found.`);
		}
		this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
		this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id: user['id'] } ] });
		
		if (user['emailVerifiedAt']) {
			throw new MethodNotAllowedException(`Current account already verified.`);
		}
		if ((Date.now() - user['createdAt'].getTime()) > 86400000) {
			throw new MethodNotAllowedException(`Key expired.`);
		}
		await this.repository.save({ 
			...user, 
			emailVerifyKey: '',
			emailVerifiedAt: new Date(),
		});

		return true;
	}

	async login(payload): Promise<any> {
		const user = await this.repository.findOne({
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
		throw new MethodNotAllowedException(`Wrong password specified.`);
	}

	async recovery(payload): Promise<any> {
		const user = await this.repository.findOne({
			where: {
				email: payload['email'],
			},
		});

		if (!user) {
			throw new NotFoundException(`User with login "${payload['login']}" not found.`);
		}
		if (!user['emailVerifiedAt']) {
			throw new MethodNotAllowedException(`The current user has not activated an account.`);
		}
		const output = { 
			...user, 
			emailVerifyKey: await generateVerifyKey(payload['email']),
		};

		await this.repository.save({
			...user,
			...output,
		});
		await this.transport.send({ 
			name: process.env.SERVICE_MAIL,
			cmd: 'report.create',
		}, {
			letterId: 'happ-mail-letter-base-recovery', 
			email: payload['email'],
			action: `Recovery access for "${payload['email']}"`,
			reportStatusId: 'happ-mail-report-status-send',
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

	async reset(payload): Promise<any> {
		const user = await this.repository.findOne({
			where: {
				email: payload['email'],
			},
		});

		if (!user) {
			throw new NotFoundException(`User with login "${payload['login']}" not found.`);
		}
		if (!user['emailVerifiedAt']) {
			throw new MethodNotAllowedException(`Current account already verified.`);
		}
		if (user['emailVerifyKey'] !== payload['verifyKey']) {
			throw new MethodNotAllowedException(`Key not validated.`);
		}
		await this.repository.save({
			...user,
			password: await encryptPassword(payload['password']),
			emailVerifyKey: '',
		});
		return true;
	}

	async refresh(payload): Promise<any> {
		const user = await this.repository.findOne({
			where: {
				id: payload['id'],
			},
			relations: {
				userUserOptions: {
					userOption: true,
				},
			},
		});

		if (!user) {
			throw new NotFoundException(`User is undefined.`);
		}
		return await generateTokens(user);
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

	protected async manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>> {
		if (this.withCache === true) {
			const cachedData = await this.repositoryCache.one({ key: [ this.prefix(process.env.APP_NAME), 'many', processedPayload ] });

			if (cachedData) {
				return cachedData;
			}
		}
		const isUnique = (processedPayload['filter'] || {})['isUnique'];

		delete (processedPayload['filter'] || {})['isUnique'];

		console.log('>>>>>>>>>', processedPayload['filter']);

		if (isUnique
			&& utilsCheckObjFilled(processedPayload['filter'])
			&& utilsCheckObjFilled(processedPayload['filter']['userUserOptions'])
			&& utilsCheckStrIdExists(processedPayload['filter']['userUserOptions']['userOptionId'])) {
			const filterKeys = Object.keys(processedPayload['filter'] || {});
			const sortKeys = Object.keys(processedPayload['sort'] || {});
			const columns = this.manyGetColumns();
			const columnsKeys = Object.keys(this.manyGetColumns());

			console.log('#############', `SELECT
					\`user\`.\`id\` AS \`userId\`,
					\`user\`.\`roleId\` AS \`userRoleId\`,
					\`user\`.\`userStatusId\` AS \`userUserStatusId\`,
					\`user\`.\`email\` AS \`userEmail\`,
					\`user\`.\`login\` AS \`userlogin\`,
					\`user\`.\`isNotDelete\` AS \`userIsNotDelete\`,
					\`user\`.\`isDeleted\` AS \`userIsDeleted\`,
					\`user\`.\`createdAt\` AS \`userCreatedAt\`,
					\`user\`.\`updatedAt\` AS \`userUpdatedAt\`,
					\`user_user_option\`.\`id\` AS \`userUserOptionId\`,
					\`user_user_option\`.\`parentId\` AS \`userUserOptionParentId\`,
					\`user_user_option\`.\`userOptionId\` AS \`userOptionId\`,
					\`user_user_option\`.\`userId\` AS \`userUserOptionUserId\`,
					\`user_user_option\`.\`content\` AS \`userUserOptionContent\`,
					\`user_user_option\`.\`isDeleted\` AS \`userUserOptionIsDeleted\`,
					\`user_user_option\`.\`createdAt\` AS \`userUserOptionCreatedAt\`,
					\`user_user_option\`.\`updatedAt\` AS \`userUserOptionUpdatedAt\`
				FROM \`user\` 
				LEFT JOIN \`user_user_option\`
				ON \`user\`.\`id\` = \`user_user_option\`.\`userId\`
				WHERE \`user_user_option\`.\`userOptionId\` = "${processedPayload['filter']['userUserOptions']['userOptionId']}"
				GROUP BY \`user_user_option\`.\`content\`
				${sortKeys.length > 0
					? `ORDER BY ${sortKeys.map((key) => `\`${key}\` ${processedPayload['sort'][key]}`).join(',')}`
					: ''}
				${processedPayload['page']
					? `LIMIT ${processedPayload['page'] - 1}${processedPayload['limit']
						? ``
						: ',20'}`
					: ''}${processedPayload['limit']
						? (processedPayload['page']
							? `,${processedPayload['limit']}`
							: `LIMIT ${processedPayload['limit']}`)
						: ''};`);

			const requestData = await this.connection.query(`SELECT
					\`user\`.\`id\` AS \`userId\`,
					\`user\`.\`roleId\` AS \`userRoleId\`,
					\`user\`.\`userStatusId\` AS \`userUserStatusId\`,
					\`user\`.\`email\` AS \`userEmail\`,
					\`user\`.\`login\` AS \`userlogin\`,
					\`user\`.\`isNotDelete\` AS \`userIsNotDelete\`,
					\`user\`.\`isDeleted\` AS \`userIsDeleted\`,
					\`user\`.\`createdAt\` AS \`userCreatedAt\`,
					\`user\`.\`updatedAt\` AS \`userUpdatedAt\`,
					\`user_user_option\`.\`id\` AS \`userUserOptionId\`,
					\`user_user_option\`.\`parentId\` AS \`userUserOptionParentId\`,
					\`user_user_option\`.\`userOptionId\` AS \`userUserOptionUserOptionId\`,
					\`user_user_option\`.\`userId\` AS \`userUserOptionUserId\`,
					\`user_user_option\`.\`content\` AS \`userUserOptionContent\`,
					\`user_user_option\`.\`isDeleted\` AS \`userUserOptionIsDeleted\`,
					\`user_user_option\`.\`createdAt\` AS \`createdAt\`,
					\`user_user_option\`.\`updatedAt\` AS \`updatedAt\`
				FROM \`user\` 
				LEFT JOIN \`user_user_option\`
				ON \`user\`.\`id\` = \`user_user_option\`.\`userId\`
				WHERE 
					\`user_user_option\`.\`userOptionId\` = "${processedPayload['filter']['userUserOptions']['userOptionId']}"
					AND
					\`user_user_option\`.\`content\` != ""
				GROUP BY \`user_user_option\`.\`content\`
				${sortKeys.length > 0
					? `ORDER BY ${sortKeys.map((key) => `\`${key}\` ${processedPayload['sort'][key]}`).join(',')}`
					: ''}
				${processedPayload['page']
					? `LIMIT ${processedPayload['page'] - 1}${processedPayload['limit']
						? ``
						: ',20'}`
					: ''}${processedPayload['limit']
						? (processedPayload['page']
							? `,${processedPayload['limit']}`
							: `LIMIT ${processedPayload['limit']}`)
						: ''};`);
			
			return [ requestData, requestData.length ];
		}
		const condition = await this.findMany(processedPayload);
		const output = await this.repository.findAndCount(condition);

		if (this.withCache === true) {
			await this.repositoryCache.create({ key: [ this.prefix(process.env.APP_NAME), 'many', processedPayload ], output });
		}
		return output;
	}
}
