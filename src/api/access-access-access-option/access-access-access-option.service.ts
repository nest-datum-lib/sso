import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessAccessOptionService as BaseAccessAccessAccessOptionService } from '@nest-datum/access';
import { AccessAccessAccessOption } from './access-access-access-option.entity';

@Injectable()
export class AccessAccessAccessOptionService extends BaseAccessAccessAccessOptionService {
	protected readonly repositoryConstructor = AccessAccessAccessOption;

	constructor(
		@InjectRepository(AccessAccessAccessOption) protected readonly repository: Repository<AccessAccessAccessOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
