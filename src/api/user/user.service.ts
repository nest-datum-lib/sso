import { v4 as uuidv4 } from 'uuid';
import getCurrentLine from 'get-current-line';
import { 
	Inject,
	Injectable, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SqlService } from 'nest-datum/sql/src';
import { CacheService } from 'nest-datum/cache/src';
import { BalancerService } from 'nest-datum/balancer/src';
import { 
	ErrorException,
	WarningException, 
	NotFoundException,
} from 'nest-datum/exceptions/src';
import {
	generateVerifyKey,
	encryptPassword,
	checkPassword,
	generateTokens,
} from 'nest-datum/jwt/src';
import { User } from './user.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';

@Injectable()
export class UserService extends SqlService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(UserUserOption) private readonly userUserOptionRepository: Repository<UserUserOption>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
		private readonly balancerService: BalancerService,
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
			this.cacheService.clear([ 'user', 'many' ]);

			const data = {
				...payload,
				password: await encryptPassword(payload['password']),
				emailVerifyKey: await generateVerifyKey(payload['email']),
			};
			const output = await this.userRepository.save(data);

			// TODO: перехват ошибки и откат транзакции
			await this.balancerService.send({ 
				name: 'mail',
				cmd: 'letter.send',
			}, {
				id: 'letter-register', 
				body: data,
			});
			await queryRunner.commitTransaction();

			return {
				id: output['id'],
				login: output['id'],
				firstname: output['firstname'],
				lastname: output['lastname'],
			};
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		finally {
			await queryRunner.release();
		}
	};

	async verify(payload): Promise<any> {
		try {
			this.cacheService.clear([ 'user', 'many' ]);

			const user = await this.userRepository.findOne({
				where: {
					email: payload['email'],
				},
			});
			
			if (!user) {
				throw new NotFoundException(`User with email "${payload['email']}" not found.`, getCurrentLine(), payload);
			}
			if (user['emailVerifiedAt']) {
				throw new WarningException(`Current account already verified.`, getCurrentLine(), payload);
			}
			if (user['emailVerifyKey'] !== payload['verifyKey']) {
				throw new WarningException(`Key not validated.`, getCurrentLine(), payload);
			}
			if ((Date.now() - user['createdAt'].getTime()) > 86400000) {
				throw new WarningException(`Key expired.`, getCurrentLine(), payload);
			}
			await this.userRepository.save({ 
				...user, 
				emailVerifyKey: '',
				emailVerifiedAt: new Date(),
			});

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	};

	async login(payload): Promise<any> {
		try {
			const user = await this.userRepository.findOne({
				where: {
					email: payload['login'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`, getCurrentLine(), payload);
			}
			if (await checkPassword(payload['password'], user['password'])) {
				return await generateTokens(user);
			}
			throw new WarningException(`Wrong password specified.`, getCurrentLine(), payload);
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	};

	async recovery(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner();

		try {
			await queryRunner.startTransaction();

			const user = await this.userRepository.findOne({
				where: {
					email: payload['email'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`, getCurrentLine(), payload);
			}
			if (!user['emailVerifiedAt']) {
				throw new WarningException(`The current user has not activated an account.`, getCurrentLine(), payload);
			}
			const output = { 
				...user, 
				emailVerifyKey: await generateVerifyKey(payload['email']),
			};

			await this.userRepository.save(output);
			
			// TODO: перехват ошибки и откат транзакции
			await this.balancerService.send({
				name: 'mail', 
				cmd: 'letter.send',
			}, {
				id: 'letter-recovery',
				body: output,
			});
			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		finally {
			await queryRunner.release();
		}
	};

	async reset(payload): Promise<any> {
		try {
			const user = await this.userRepository.findOne({
				where: {
					email: payload['email'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with login "${payload['login']}" not found.`, getCurrentLine(), payload);
			}
			if (!user['emailVerifiedAt']) {
				throw new WarningException(`Current account already verified.`, getCurrentLine(), payload);
			}
			if (user['emailVerifyKey'] !== payload['password']) {
				throw new WarningException(`Key not validated.`, getCurrentLine(), payload);
			}
			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	};

	async refresh(payload): Promise<any> {
		try {
			const user = await this.userRepository.findOne({
				where: {
					id: payload['id'],
				},
			});

			if (!user) {
				throw new NotFoundException(`User with email "${payload['email']}" not found.`, getCurrentLine(), payload);
			}
			return await generateTokens(user);
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'user', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.userRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set([ 'user', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'user', 'one', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.userRepository.findOne(await this.findOne(payload));
		
			if (output) {
				await this.cacheService.set([ 'user', 'one', payload ], output);
			}
			if (!output) {
				return new NotFoundException('Entity is undefined', getCurrentLine(), { user, ...payload });
			}
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async drop({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'user', 'many' ]);
			this.cacheService.clear([ 'user', 'one', payload ]);

			await this.userUserOptionRepository.delete({ userId: payload['id'] });
			await this.dropByIsDeleted(this.userRepository, payload['id']);

			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}

	async dropMany({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'user', 'many' ]);
			this.cacheService.clear([ 'user', 'one', payload ]);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.userUserOptionRepository.delete({ userId: payload['ids'][i] });
				await this.dropByIsDeleted(this.userRepository, payload['ids'][i]);
				i++;
			}
			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}

	async create({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'user', 'many' ]);

			const output = await this.userRepository.save(payload);

			await queryRunner.commitTransaction();

			return output;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}

	async createOptions({ user, id, data }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'user', 'many' ]);

			await this.userUserOptionRepository.delete({
				userId: id,
			});

			let i = 0,
				ii = 0;

			console.log('data', data);

			while (i < data.length) {
				ii = 0;

				const option = data[i];

				console.log('option', option);

				while (ii < option.length) {
					const newId = uuidv4();
					console.log('===========', {
						...option[ii],
						userId: option[ii]['entityId'],
						userOptionId: option[ii]['entityOptionId'],
						id: newId,
					});

					const output = await this.userUserOptionRepository.save({
						...option[ii],
						userId: option[ii]['entityId'],
						userOptionId: option[ii]['entityOptionId'],
						id: newId,
					});
					ii++;
				}
				i++;
			}
			await queryRunner.commitTransaction();
			
			return true;
		}
		catch (err) {
			console.log('err', err);

			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, id, data });
		}
		finally {
			await queryRunner.release();
		}
	}

	async update({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'user', 'many' ]);
			this.cacheService.clear([ 'user', 'one' ]);
			
			await this.updateWithId(this.userRepository, payload);
			
			await queryRunner.commitTransaction();
			
			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}
}
