import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessService as BaseAccessService } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';

@Injectable()
export class AccessService extends BaseAccessService {
	protected entityConstructor = Access;
	protected entityOptionConstructor = AccessAccessOption;

	constructor(
		@InjectRepository(Access) protected entityRepository: Repository<Access>,
		@InjectRepository(AccessAccessOption) protected entityOptionRepository: Repository<AccessAccessOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
