import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleOption } from './role-option.entity';

@Injectable()
export class RoleOptionService extends OptionService {
	protected entityName = 'roleOption';
	protected entityServicedName = 'role';
	protected entityId = 'roleId';
	protected entityOptionId = 'roleOptionId';
	protected entityOptionRelationId = 'roleRoleOptionId';
	protected entityConstructor = RoleOption;
	protected entityOptionConstructor = RoleRoleOption;
	protected entityOptionRelationConstructor = RoleRoleRoleOption;

	constructor(
		@InjectRepository(RoleOption) protected entityRepository: Repository<RoleOption>,
		@InjectRepository(RoleRoleOption) protected entityOptionRepository: Repository<RoleRoleOption>,
		@InjectRepository(RoleRoleRoleOption) protected entityOptionRelationRepository: Repository<RoleRoleRoleOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
