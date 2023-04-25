import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { CacheService } from '@nest-datum/cache';
import { ManyService } from '@nest-datum/many';
import { RoleRoleRoleOption } from './role-role-role-option.entity';

@Injectable()
export class RoleRoleRoleOptionService extends ManyService {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleRoleOptionId';
	protected readonly repositoryConstructor = RoleRoleRoleOption;

	constructor(
		@InjectRepository(RoleRoleRoleOption) protected readonly repository: Repository<RoleRoleRoleOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
