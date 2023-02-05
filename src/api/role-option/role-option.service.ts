import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService as NestDatumOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleOption } from './role-option.entity';

@Injectable()
export class RoleOptionService extends NestDatumOptionService {
	public entityName = 'roleOption';
	public entityColumnOption = 'roleOptionId';
	public entityConstructor = RoleOption;

	constructor(
		@InjectRepository(RoleOption) public repository: Repository<RoleOption>,
		@InjectRepository(RoleRoleOption) public repositoryOptionOption: Repository<RoleRoleOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, repositoryOptionOption, connection, cacheService);
	}
}
