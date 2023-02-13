import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { AccessStatus } from './access-status.entity';

@Injectable()
export class AccessStatusService extends StatusService {
	protected entityName = 'accessStatus';
	protected entityConstructor = AccessStatus;

	constructor(
		@InjectRepository(AccessStatus) protected entityRepository: Repository<AccessStatus>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
