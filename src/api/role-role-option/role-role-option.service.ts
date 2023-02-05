import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionOptionService as NestDatumOptionOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from './role-role-option.entity';

@Injectable()
export class RoleRoleOptionService extends NestDatumOptionOptionService {
	public entityName = 'roleRoleOption';
	public entityConstructor = RoleRoleOption;

	constructor(
		@InjectRepository(RoleRoleOption) public repository: Repository<RoleRoleOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}

	protected selectDefaultMany = {
		id: true,
		roleId: true,
		roleOptionId: true,
		createdAt: true,
		updatedAt: true,
	};
}
