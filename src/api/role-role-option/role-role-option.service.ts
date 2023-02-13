import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from './role-role-option.entity';

@Injectable()
export class RoleRoleOptionService extends OptionOptionService {
	protected entityName = 'roleRoleOption';
	protected entityConstructor = RoleRoleOption;
	protected entityOptionId = 'roleOptionId';
	protected entityId = 'roleId';

	constructor(
		@InjectRepository(RoleRoleOption) protected entityRepository: Repository<RoleRoleOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
