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
import { Role } from './role.entity';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleAccess } from '../role-access/role-access.entity';

@Injectable()
export class RoleService extends MysqlService {
	constructor(
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(RoleRoleRoleOption) private readonly roleRoleRoleOptionRepository: Repository<RoleRoleRoleOption>,
		@InjectRepository(RoleRoleOption) private readonly roleRoleOptionRepository: Repository<RoleRoleOption>,
		@InjectRepository(RoleAccess) private readonly roleAccessRepository: Repository<RoleAccess>,
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
		roleStatusId: true,
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
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.role.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.role.many`, payload, output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}

		return [ [], 0 ];
	}

	async one(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.role.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.roleRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.role.one`, payload, output);

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async drop(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`, payload);

			await this.roleRoleRoleOptionRepository.delete({ roleId: payload['id'] });
			await this.roleRoleOptionRepository.delete({ roleId: payload['id'] });
			await this.dropByIsDeleted(this.roleRepository, payload['id']);

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

	async dropMany(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`, payload);

			let i = 0;

			while (i < payload['ids'].length) {
				await this.roleRoleRoleOptionRepository.delete({ roleId: payload['ids'][i] });
				await this.roleRoleOptionRepository.delete({ roleId: payload['ids'][i] });
				await this.dropByIsDeleted(this.roleRepository, payload['ids'][i]);
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
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleOption.many`);

			await this.roleRoleRoleOptionRepository.delete({ roleRoleOptionId: payload['id'] });
			await this.roleRoleOptionRepository.delete({ id: payload['id'] });

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
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);

			const output = await this.roleRepository.save({
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
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleOption.many`);

			const roleRoleOption = await this.roleRoleOptionRepository.save({
				roleId: id,
				roleOptionId: optionId,
				...data,
			});
			
			const output = await this.one({
				user,
				id,
			});

			output['roleRoleOptions'] = [ roleRoleOption ];

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
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);

			await this.roleRoleRoleOptionRepository.delete({
				roleId: id,
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

					const output = await this.roleRoleRoleOptionRepository.save({
						...optionData,
						roleId: id,
						roleRoleOptionId: entityOptionId,
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

	async createAccesses({ user, id, data }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`)

			await this.roleAccessRepository.delete({
				roleId: id,
			});

			let i = 0,
				ii = 0;

			while (i < data.length) {
				ii = 0;

				const option = data[i];

				while (ii < option.length) {
					const output = await this.roleAccessRepository.save({
						...option[ii],
						id: option[ii]['id'] || uuidv4(),
						roleId: id,
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
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`);
			
			await this.updateWithId(this.roleRepository, {
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
