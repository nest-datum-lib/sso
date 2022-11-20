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
import { AccessStatus } from './access-status.entity';

@Injectable()
export class AccessStatusService extends MysqlService {
	constructor(
		@InjectRepository(AccessStatus) private readonly accessStatusRepository: Repository<AccessStatus>,
		private readonly connection: Connection,
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		name: true,
		description: true,
		isDeleted: true,
		isNotDelete: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		name: true,
		description: true,
	};

	async many(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.accessStatus.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessStatusRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.accessStatus.many`, payload, output);
			
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
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.accessStatus.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessStatusRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.accessStatus.one`, payload, output);
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
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.one`, payload);

			await this.dropByIsDeleted(this.accessStatusRepository, payload['id']);
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
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.one`, payload);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.dropByIsDeleted(this.accessStatusRepository, payload['ids'][i]);
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
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.many`);

			const output = await this.accessStatusRepository.save({
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
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.one`);
			
			await this.updateWithId(this.accessStatusRepository, {
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
