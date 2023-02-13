import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserOption } from './user-option.entity';

@Injectable()
export class UserOptionService extends OptionService {
	protected entityName = 'userOption';
	protected entityServicedName = 'user';
	protected entityId = 'userId';
	protected entityOptionId = 'userOptionId';
	protected entityOptionRelationId = 'userOptionId';
	protected entityConstructor = UserOption;
	protected entityOptionConstructor = UserUserOption;
	protected entityOptionRelationConstructor = UserUserOption;

	constructor(
		@InjectRepository(UserOption) protected entityRepository: Repository<UserOption>,
		@InjectRepository(UserUserOption) protected entityOptionRepository: Repository<UserUserOption>,
		@InjectRepository(UserUserOption) protected entityOptionRelationRepository: Repository<UserUserOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
