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
	protected readonly entityName: string = 'userStatus';
	protected readonly repositoryConstructor = UserStatus;

	constructor(
		@InjectRepository(UserStatus) protected readonly repository: Repository<UserStatus>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
