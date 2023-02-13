import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { StatusService } from '@nest-datum/status';
import { CacheService } from '@nest-datum/cache';
import { UserStatus } from './user-status.entity';

@Injectable()
export class UserStatusService extends StatusService {
	protected entityName = 'userStatus';
	protected entityConstructor = UserStatus;

	constructor(
		@InjectRepository(UserStatus) protected entityRepository: Repository<UserStatus>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
