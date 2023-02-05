import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService as NestDatumStatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { AccessStatus } from './access-status.entity';

@Injectable()
export class AccessStatusService extends NestDatumStatusService {
	public entityConstructor = AccessStatus;

	constructor(
		@InjectRepository(AccessStatus) public repository: Repository<AccessStatus>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}
}
