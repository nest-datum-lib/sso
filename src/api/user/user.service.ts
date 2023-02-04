import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { 
	ErrorException,
	WarningException, 
	NotFoundException,
} from '@nest-datum-common/exceptions';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import {
	encryptPassword,
	generateVerifyKey,
	generateTokens,
	checkPassword,
} from '@nest-datum/jwt';
import { User } from './user.entity';

@Injectable()
export class UserService extends SqlService {
	public entityName = 'user';
	public entityConstructor = User;

	constructor(
		@InjectRepository(User) public repository: Repository<User>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		roleId: true,
		userStatusId: true,
		login: true,
		email: true,
		isDeleted: true,
		isNotDelete: true,
		emailVerifyKey: true,
		emailVerifiedAt: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		login: true,
		email: true,
	};

	async register(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
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
			const output = await queryRunner.manager.save(Object.assign(new User(), data));

			// await queryRunner.manager.save(Object.assign(new UserUserOption(), {
			// 	userId: output['id'],
			// 	userOptionId: 'sso-user-option-firstname',
			// 	content: firstname,
			// }));
			// await queryRunner.manager.save(Object.assign(new UserUserOption(), {
			// 	userId: output['id'],
			// 	userOptionId: 'sso-user-option-lastname',
			// 	content: lastname,
			// }));

			// await this.balancerService.send({ 
			// 	name: 'mail',
			// 	cmd: 'letter.send',
			// }, {
			// 	accessToken: generateAccessToken({
			// 		id: 'sso-user-admin',
			// 		roleId: 'sso-role-admin',
			// 		email: process.env.USER_ROOT_EMAIL,
			// 	}, Date.now()),
			// 	letterId: 'mail-letter-register', 
			// 	body: {
			// 		...data,
			// 		firstname,
			// 		lastname,
			// 	},
			// });

			await queryRunner.commitTransaction();

			return {
				id: output['id'],
				login: output['id'],
			};
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			throw new ErrorException(err.message);
		}
		finally {
			await queryRunner.release();
		}
	}

	async verify(payload): Promise<any> {
		try {
			this.cacheService.clear([ this.entityName, 'many' ]);

			const user = await this.repository.findOne({
				where: {
					email: payload['email'],
				},
			});
			
			if (!user) {
				throw new NotFoundException(`User with email "${payload['email']}" not found.`);
			}
			if (user['emailVerifiedAt']) {
				throw new WarningException(`Current account already verified.`);
			}
			if (user['emailVerifyKey'] !== payload['verifyKey']) {
				throw new WarningException(`Key not validated.`);
			}
			if ((Date.now() - user['createdAt'].getTime()) > 86400000) {
				throw new WarningException(`Key expired.`);
			}
			await this.repository.save({ 
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
			const user = await this.repository.findOne({
				where: [
					{ email: payload['login'] },
					{ login: payload['login'] },
				],
				// relations: {
				// 	userUserOptions: {
				// 		userOption: true,
				// 	},
				// },
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
			const user = await this.repository.findOne({
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

			await this.repository.save({
				...user,
				...output,
			});

			// await this.balancerService.send({ 
			// 	name: 'mail',
			// 	cmd: 'letter.send',
			// }, {
			// 	accessToken: generateAccessToken({
			// 		id: 'sso-user-admin',
			// 		roleId: 'sso-role-admin',
			// 		email: process.env.USER_ROOT_EMAIL,
			// 	}, Date.now()),
			// 	letterId: 'mail-letter-recovery', 
			// 	body: {
			// 		...output,
			// 	},
			// });

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}

	async reset(payload): Promise<any> {
		try {
			const user = await this.repository.findOne({
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
			await this.repository.save({
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
			const user = await this.repository.findOne({
				where: {
					id: payload['id'],
				},
				// relations: {
				// 	userUserOptions: {
				// 		userOption: true,
				// 	},
				// },
			});

			if (!user) {
				throw new NotFoundException(`User with email "${payload['email']}" not found.`);
			}
			return await generateTokens(user);
		}
		catch (err) {
			throw new ErrorException(err.message);
		}
	}
}
