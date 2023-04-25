import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { AccessStatusService as AccessStatusServiceBase } from '@nest-datum/access';
import { StatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { AccessStatus } from './access-status.entity';

@Injectable()
export class AccessStatusService extends AccessStatusServiceBase {
	protected repositoryConstructor = AccessStatus;

	constructor(
		@InjectRepository(AccessStatus) protected readonly repository: Repository<AccessStatus>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
