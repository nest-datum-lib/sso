import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import {
	strIdExists as utilsCheckStrIdExists,
	objFilled as utilsCheckObjFilled,
} from '@nest-datum-utils/check';
import { MainService } from '@nest-datum/main';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends MainService {
	protected readonly withEnvKey: boolean = true;
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly repositoryConstructor = Role;
	protected readonly repositoryBindOptionConstructor = RoleRoleOption;
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';

	constructor(
		@InjectRepository(Role) protected readonly repository: Repository<Role>,
		@InjectRepository(RoleRoleOption) protected repositoryBindOption: Repository<RoleRoleOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			userId: true,
			envKey: true,
			roleStatusId: true,
			name: true,
			description: true,
		});
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			userId: true,
			envKey: true,
			roleStatusId: true,
			name: true,
			description: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			envKey: true,
			name: true,
			description: true,
		});
	}
}
