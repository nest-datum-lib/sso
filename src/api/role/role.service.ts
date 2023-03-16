import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionEntityService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends OptionEntityService {
	protected entityName = 'role';
	protected entityOptionId = 'roleOptionId';
	protected entityId = 'roleId';
	protected entityConstructor = Role;
	protected entityOptionConstructor = RoleRoleOption;

	constructor(
		@InjectRepository(Role) protected entityRepository: Repository<Role>,
		@InjectRepository(RoleRoleOption) protected entityOptionRepository: Repository<RoleRoleOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			userId: true,
			roleStatusId: true,
			name: true,
			description: true,
			isDeleted: true,
			isNotDelete: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			...super.manyGetQueryColumns(customColumns),
			name: true,
			description: true,
		});
	}
}
