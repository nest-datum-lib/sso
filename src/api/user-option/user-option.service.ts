import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import getCurrentLine from 'get-current-line';
import { 
	Inject,
	Injectable, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { 
	MysqlService,
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { ErrorException } from '@nest-datum/exceptions';
import { UserOption } from './user-option.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';

@Injectable()
export class UserOptionService extends MysqlService {
	constructor(
		@InjectRepository(UserOption) private readonly userOptionRepository: Repository<UserOption>,
		@InjectRepository(UserUserOption) private readonly userUserOptionRepository: Repository<UserUserOption>,
		private readonly connection: Connection,
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		name: true,
		description: true,
		dataTypeId: true,
		defaultValue: true,
		regex: true,
		isRequired: true,
		isDeleted: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		name: true,
		description: true,
		defaultValue: true,
		regex: true,
	};

	async many(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.userOption.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.userOptionRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.userOption.many`, payload, output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		await this.registryService.clearResources();

		return [ [], 0 ];
	}

	async one(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.userOption.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.userOptionRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.userOption.one`, payload, output);
			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			await this.registryService.clearResources();

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async drop(payload): Promise<any> {
		try {
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.one`, payload);

			await this.userUserOptionRepository.delete({ userOptionId: payload['id'] });
			await this.dropByIsDeleted(this.userOptionRepository, payload['id']);
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			await this.registryService.clearResources();

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async dropMany(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.one`, payload);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.dropByIsDeleted(this.userOptionRepository, payload['ids'][i]);
				i++;
			}
			await queryRunner.commitTransaction();
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			await this.registryService.clearResources();

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		finally {
			await queryRunner.release();
			await this.registryService.clearResources();
		}
	}

	async create({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.many`);

			const output = await this.userOptionRepository.save({
				...payload,
				userId: payload['userId'] || user['id'] || '',
			});

			await queryRunner.commitTransaction();
			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			await this.registryService.clearResources();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
			await this.registryService.clearResources();
		}
	}

	async update({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.one`);
			
			await this.updateWithId(this.userOptionRepository, {
				...payload,
				userId: payload['userId'] || user['id'] || '',
			});
			
			await queryRunner.commitTransaction();
			await this.registryService.clearResources();
			
			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			await this.registryService.clearResources();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
			await this.registryService.clearResources();
		}
	}
}
