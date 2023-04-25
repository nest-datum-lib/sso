import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessAccessOptionService as AccessAccessOptionServiceBase } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from './access-access-option.entity';

@Injectable()
export class AccessAccessOptionService extends AccessAccessOptionServiceBase {
	protected repositoryConstructor = AccessAccessOption;
	
	constructor(
		@InjectRepository(AccessAccessOption) protected repository: Repository<AccessAccessOption>,
		protected connection: Connection,
		protected repositoryCache: CacheService,
	) {
		super();
	}
}
