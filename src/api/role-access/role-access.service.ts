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
import { RoleAccess } from './role-access.entity';

@Injectable()
export class RoleAccessService extends SqlService {
	constructor(
		@InjectRepository(RoleAccess) private readonly roleAccessRepository: Repository<RoleAccess>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		roleId: true,
		accessId: true,
		createdAt: true,
	};

	protected queryDefaultMany = {
		id: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'role', 'access', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleAccessRepository.findAndCount(await this.findMany(payload));

			this.cacheService.set([ 'role', 'access', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}

		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'role', 'access', 'one' , payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleAccessRepository.findOne(await this.findOne(payload));
		
			if (output) {
				this.cacheService.set([ 'role', 'access', 'one', payload ], output);
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

	async drop({ user, ...payload }): Promise<any> {
		try {
			this.cacheService.clear([ 'role', 'access', 'many' ]);
			this.cacheService.clear([ 'role', 'access', 'one', payload ]);

			await this.roleAccessRepository.delete({ id: payload['id'] });

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async dropMany({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'role', 'access', 'many' ]);
			this.cacheService.clear([ 'role', 'access', 'one', payload ]);
			this.cacheService.clear([ 'role', 'many' ]);
			this.cacheService.clear([ 'access', 'many' ]);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.dropByIsDeleted(this.roleAccessRepository, payload['ids'][i]);
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

	async create({ user, id, roleId, accessId }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();

			this.cacheService.clear([ 'role', 'access', 'many' ]);
			this.cacheService.clear([ 'role', 'many' ]);
			this.cacheService.clear([ 'access', 'many' ]);

			const userId = (user
				&& typeof user === 'object')
				? (user['id'] || '')
				: '';
			const roleAccess = await this.roleAccessRepository.save({
				id: id || uuidv4(),
				userId,
				roleId,
				accessId,
			});
			
			roleAccess['userId'] = userId;

			await queryRunner.commitTransaction();

			return roleAccess;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, id, roleId, accessId });
		}
		finally {
			await queryRunner.release();
		}
	}
}
