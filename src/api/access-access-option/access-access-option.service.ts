import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionOptionService as NestDatumOptionOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from './access-access-option.entity';

@Injectable()
export class AccessAccessOptionService extends NestDatumOptionOptionService {
	public entityName = 'accessAccessOption';
	public entityConstructor = AccessAccessOption;

	constructor(
		@InjectRepository(AccessAccessOption) public repository: Repository<AccessAccessOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}

	protected selectDefaultMany = {
		id: true,
		accessId: true,
		accessOptionId: true,
		createdAt: true,
		updatedAt: true,
	};
}
