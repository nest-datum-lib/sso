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
	protected entityName = 'roleStatus';
	protected entityConstructor = RoleStatus;

	constructor(
		@InjectRepository(RoleStatus) protected entityRepository: Repository<RoleStatus>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
