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
import { RoleRoleOption } from './role-role-option.entity';

@Injectable()
export class RoleRoleOptionService extends SqlService {
	constructor(
		@InjectRepository(RoleRoleOption) private readonly roleRoleOptionRepository: Repository<RoleRoleOption>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		roleId: true,
		roleOptionId: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'role', 'option', 'relation', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleRoleOptionRepository.findAndCount(await this.findMany(payload));

			this.cacheService.set([ 'role', 'option', 'relation', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}

		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'role', 'option', 'relation', 'one' , payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleRoleOptionRepository.findOne(await this.findOne(payload));
		
			if (output) {
				this.cacheService.set([ 'role', 'option', 'relation', 'one', payload ], output);
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
			this.cacheService.clear([ 'role', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'role', 'option', 'relation', 'one', id ]);
			this.cacheService.clear([ 'role', 'option', 'many' ]);
			this.cacheService.clear([ 'role', 'option', 'one' ]);
			this.cacheService.clear([ 'role', 'one' ]);

			await this.roleRoleOptionRepository.delete({ id });

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
			
			this.cacheService.clear([ 'role', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'role', 'option', 'relation', 'one', payload ]);
			this.cacheService.clear([ 'role', 'option', 'many' ]);
			this.cacheService.clear([ 'role', 'many' ]);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.dropByIsDeleted(this.roleRoleOptionRepository, payload['ids'][i]);
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

	async create({ user, id, roleId, roleOptionId }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();

			this.cacheService.clear([ 'role', 'option', 'relation', 'many' ]);
			this.cacheService.clear([ 'role', 'option', 'many' ]);
			this.cacheService.clear([ 'role', 'option', 'one' ]);
			this.cacheService.clear([ 'role', 'many' ]);
			this.cacheService.clear([ 'role', 'one' ]);

			const userId = (user
				&& typeof user === 'object')
				? (user['id'] || '')
				: '';
			const roleOptionRelation = await this.roleRoleOptionRepository.save({
				id: id || uuidv4(),
				userId,
				roleId,
				roleOptionId,
			});
			
			roleOptionRelation['userId'] = userId;

			await queryRunner.commitTransaction();

			return roleOptionRelation;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, id, roleId, roleOptionId });
		}
		finally {
			await queryRunner.release();
		}
	}
}
