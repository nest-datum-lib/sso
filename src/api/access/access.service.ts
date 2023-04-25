import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessService as BaseAccessService } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { RoleAccess } from '../role-access/role-access.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';

@Injectable()
export class AccessService extends BaseAccessService {
	protected readonly repositoryConstructor = Access;
	protected readonly repositoryBindOptionConstructor = AccessAccessOption;
	protected readonly repositoryRoleAccessConstructor = RoleAccess;

	constructor(
		@InjectRepository(Access) protected readonly repository: Repository<Access>,
		@InjectRepository(AccessAccessOption) protected repositoryBindOption: Repository<AccessAccessOption>,
		@InjectRepository(RoleAccess) protected repositoryRoleAccess: Repository<RoleAccess>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
