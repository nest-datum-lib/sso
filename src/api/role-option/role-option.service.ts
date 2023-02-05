import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService as NestDatumOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { RoleOption } from './role-option.entity';

@Injectable()
export class RoleOptionService extends NestDatumOptionService {
	public entityName = 'roleOption';
	public entityConstructor = RoleOption;

	constructor(
		@InjectRepository(RoleOption) public repository: Repository<RoleOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}
}
