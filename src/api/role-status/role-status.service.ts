import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { RoleStatus } from './role-status.entity';

@Injectable()
export class RoleStatusService extends StatusService {
	protected readonly entityName: string = 'roleStatus';
	protected readonly repositoryConstructor = RoleStatus;

	constructor(
		@InjectRepository(RoleStatus) protected readonly repository: Repository<RoleStatus>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
