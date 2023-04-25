import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { BindService } from '@nest-datum/bind';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from './role-role-option.entity';

export class RoleRoleOptionService extends BindService {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';
	protected repositoryConstructor = RoleRoleOption;
	
	constructor(
		@InjectRepository(RoleRoleOption) protected repository: Repository<RoleRoleOption>,
		protected connection: Connection,
		protected repositoryCache: CacheService,
	) {
		super();
	}
}
