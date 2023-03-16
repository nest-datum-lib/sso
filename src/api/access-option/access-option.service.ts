import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessOptionService as AccessOptionServiceBase } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessOption } from './access-option.entity';

@Injectable()
export class AccessOptionService extends AccessOptionServiceBase {
	protected entityConstructor = AccessOption;
	protected entityOptionConstructor = AccessAccessOption;
	protected entityOptionRelationConstructor = AccessAccessAccessOption;

	constructor(
		@InjectRepository(AccessOption) protected entityRepository: Repository<AccessOption>,
		@InjectRepository(AccessAccessOption) protected entityOptionRepository: Repository<AccessAccessOption>,
		@InjectRepository(AccessAccessAccessOption) protected entityOptionRelationRepository: Repository<AccessAccessAccessOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
