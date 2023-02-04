import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService as NestDatumStatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { UserStatus } from './user-status.entity';

@Injectable()
export class UserStatusService extends NestDatumStatusService {
	public entityConstructor = UserStatus;

	constructor(
		@InjectRepository(UserStatus) public repository: Repository<UserStatus>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}
}
