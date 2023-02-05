import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService as NestDatumStatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { RoleStatus } from './role-status.entity';

@Injectable()
export class RoleStatusService extends NestDatumStatusService {
	public entityConstructor = RoleStatus;

	constructor(
		@InjectRepository(RoleStatus) public repository: Repository<RoleStatus>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}
}
