import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from './access-access-option.entity';

@Injectable()
export class AccessAccessOptionService extends OptionOptionService {
	protected entityName = 'accessAccessOption';
	protected entityConstructor = AccessAccessOption;
	protected entityOptionId = 'accessOptionId';
	protected entityId = 'accessId';

	constructor(
		@InjectRepository(AccessAccessOption) protected entityRepository: Repository<AccessAccessOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
