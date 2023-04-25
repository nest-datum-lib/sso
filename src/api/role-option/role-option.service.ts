import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from './role-option.entity';

@Injectable()
export class RoleOptionService extends OptionService {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';
	protected readonly optionContentColumnName: string = 'roleRoleOptionId';
	protected readonly repositoryConstructor = RoleOption;
	protected readonly repositoryOptionConstructor = RoleRoleOption;
	protected readonly repositoryContentOptionConstructor = RoleRoleRoleOption;

	constructor(
		@InjectRepository(RoleOption) protected readonly repository: Repository<RoleOption>,
		@InjectRepository(RoleRoleOption) public readonly repositoryOption: Repository<RoleRoleOption>,
		@InjectRepository(RoleRoleRoleOption) public readonly repositoryContentOption: Repository<RoleRoleRoleOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
