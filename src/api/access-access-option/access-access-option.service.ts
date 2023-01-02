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
import { SqlService } from 'nest-datum/sql/src';
import { CacheService } from 'nest-datum/cache/src';
import { 
	ErrorException,
	NotFoundException, 
} from 'nest-datum/exceptions/src';
import { AccessAccessOption } from './access-access-option.entity';

@Injectable()
export class AccessAccessOptionService extends SqlService {
	constructor(
		@InjectRepository(AccessAccessOption) private readonly accessAccessOptionRepository: Repository<AccessAccessOption>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		accessId: true,
		accessOptionId: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'access', 'option', 'relation', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessAccessOptionRepository.findAndCount(await this.findMany(payload));

			this.cacheService.set([ 'access', 'option', 'relation', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}

		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'access', 'option', 'relation', 'one' , payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.accessAccessOptionRepository.findOne(await this.findOne(payload));
		
			if (output) {
				this.cacheService.set([ 'access', 'option', 'relation', 'one', payload ], output);
			}
			else {
				return new NotFoundException('Entity is undefined', getCurrentLine(), { user, ...payload });
			}
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async drop({ user, id }): Promise<any> {
		try {
			this.cacheService.clear([ 'access', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'access', 'option', 'relation', 'one', id ]);
			this.cacheService.clear([ 'access', 'option', 'many' ]);
			this.cacheService.clear([ 'access', 'option', 'one' ]);
			this.cacheService.clear([ 'access', 'one' ]);

			await this.accessAccessOptionRepository.delete({ id });

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, id });
		}
	}

	async dropMany({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'access', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'access', 'option', 'relation', 'one', payload ]);
			this.cacheService.clear([ 'access', 'option', 'many' ]);
			this.cacheService.clear([ 'access', 'many' ]);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.dropByIsDeleted(this.accessAccessOptionRepository, payload['ids'][i]);
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

	async create({ user, id, accessId, accessOptionId }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();

			this.cacheService.clear([ 'access', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'access', 'option', 'many' ]);
			this.cacheService.clear([ 'access', 'option', 'one' ]);
			this.cacheService.clear([ 'access', 'many' ]);
			this.cacheService.clear([ 'access', 'one' ]);

			const userId = (user
				&& typeof user === 'object')
				? (user['id'] || '')
				: '';
			const accessOptionRelation = await this.accessAccessOptionRepository.save({
				id: id || uuidv4(),
				userId,
				accessId,
				accessOptionId,
			});
			
			accessOptionRelation['userId'] = userId;

			await queryRunner.commitTransaction();

			return accessOptionRelation;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, id, accessId, accessOptionId });
		}
		finally {
			await queryRunner.release();
		}
	}
}
