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
import { Access } from './access.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';

@Injectable()
export class AccessService extends MysqlService {
	constructor(
		@InjectRepository(Access) private readonly accessRepository: Repository<Access>,
		@InjectRepository(AccessAccessOption) private readonly accessAccessOptionRepository: Repository<AccessAccessOption>,
		@InjectRepository(AccessAccessAccessOption) private readonly accessAccessAccessOptionRepository: Repository<AccessAccessAccessOption>,
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
		accessStatusId: true,
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
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.access.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.access.many`, payload, output);
			
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
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.access.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.access.one`, payload, output);

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async drop(payload): Promise<any> {
		try {
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`, payload);

			await this.accessAccessAccessOptionRepository.delete({ accessId: payload['id'] });
			await this.accessAccessOptionRepository.delete({ accessId: payload['id'] });
			await this.dropByIsDeleted(this.accessRepository, payload['id']);

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async dropMany(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`, payload);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.accessAccessAccessOptionRepository.delete({ accessId: payload['ids'][i] });
				await this.accessAccessOptionRepository.delete({ accessId: payload['ids'][i] });
				await this.dropByIsDeleted(this.accessRepository, payload['ids'][i]);
				i++;
			}
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
	}

	async dropOption(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessOption.many`);

			await this.accessAccessAccessOptionRepository.delete({ accessAccessOptionId: payload['id'] });
			await this.accessAccessOptionRepository.delete({ id: payload['id'] });

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
	}

	async create({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);

			const output = await this.accessRepository.save({
				...payload,
				userId: payload['userId'] || user['id'] || '',
			});

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

	async createOption({ 
		user, 
		id,
		optionId, 
		data, 
	}): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner();

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessOption.many`);

			const accessAccessOption = await this.accessAccessOptionRepository.save({
				accessId: id,
				accessOptionId: optionId,
				...data,
			});
			
			const output = await this.one({
				user,
				id,
			});

			output['accessAccessOptions'] = [ accessAccessOption ];

			await queryRunner.commitTransaction();

			return output;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, id, optionId, data });
		}
		finally {
			await queryRunner.release();
		}
	}

	async createOptions({ user, id, data }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner();

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);

			await this.accessAccessAccessOptionRepository.delete({
				accessId: id,
			});

			let i = 0,
				ii = 0;

			while (i < data.length) {
				ii = 0;

				const option = data[i];

				while (ii < option.length) {
					const {
						entityOptionId,
						entityId,
						id: itemId,
						...optionData
					} = option[ii];

					const output = await this.accessAccessAccessOptionRepository.save({
						...optionData,
						accessId: id,
						accessAccessOptionId: entityOptionId,
					});

					ii++;
				}
				i++;
			}
			await queryRunner.commitTransaction();
			
			return true;
		}
		catch (err) {
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
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`);
			
			await this.updateWithId(this.accessRepository, {
				...payload,
				userId: payload['userId'] || user['id'] || '',
			});
			
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
