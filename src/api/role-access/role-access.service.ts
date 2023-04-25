import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { RoleAccessService as RoleAccessServiceBase } from '@nest-datum/access';
import { CacheService } from '@nest-datum/cache';
import { RoleAccess } from './role-access.entity';

@Injectable()
export class RoleAccessService extends RoleAccessServiceBase {
	protected repositoryConstructor = RoleAccess;

	constructor(
		@InjectRepository(RoleAccess) protected repository: Repository<RoleAccess>,
		protected connection: Connection,
		protected repositoryCache: CacheService,
	) {
		super();
	}
}
