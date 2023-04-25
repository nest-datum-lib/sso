import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessOptionService as AccessOptionServiceBase } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from './access-option.entity';

@Injectable()
export class AccessOptionService extends AccessOptionServiceBase {
	protected readonly repositoryConstructor = AccessOption;
	protected readonly repositoryOptionConstructor = AccessAccessOption;
	protected readonly repositoryContentOptionConstructor = AccessAccessAccessOption;

	constructor(
		@InjectRepository(AccessOption) protected readonly repository: Repository<AccessOption>,
		@InjectRepository(AccessAccessOption) public readonly repositoryOption: Repository<AccessAccessOption>,
		@InjectRepository(AccessAccessAccessOption) public readonly repositoryContentOption: Repository<AccessAccessAccessOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
