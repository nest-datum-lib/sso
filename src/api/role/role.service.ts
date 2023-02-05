import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { 
	ErrorException,
	WarningException, 
	NotFoundException,
} from '@nest-datum-common/exceptions';
import { WithOptionService as SqlWithOptionService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import {
	encryptPassword,
	generateVerifyKey,
	generateTokens,
	checkPassword,
} from '@nest-datum/jwt';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends SqlWithOptionService {
	public entityName = 'role';
	public entityConstructor = Role;
	public optionId = 'roleId';
	public optionOptionId = 'roleRoleOptionId';
	public optionRelationConstructor = RoleRoleRoleOption;

	constructor(
		@InjectRepository(Role) public repository: Repository<Role>,
		@InjectRepository(RoleRoleOption) public repositoryOption: Repository<RoleRoleOption>,
		@InjectRepository(RoleRoleRoleOption) public repositoryOptionRelation: Repository<RoleRoleRoleOption>,
		public connection: Connection,
		public cacheService: CacheService,
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
}
