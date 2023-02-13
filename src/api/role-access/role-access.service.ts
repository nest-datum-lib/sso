import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleAccess } from './role-access.entity';

@Injectable()
export class RoleAccessService extends OptionOptionService {
	protected entityName = 'roleRoleOption';
	protected entityConstructor = RoleAccess;
	protected entityOptionId = 'accessId';
	protected entityId = 'roleId';

	constructor(
		@InjectRepository(RoleAccess) protected entityRepository: Repository<RoleAccess>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
