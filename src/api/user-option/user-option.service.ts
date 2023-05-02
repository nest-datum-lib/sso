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
	protected readonly mainRelationColumnName: string = 'userId';
	protected readonly optionRelationColumnName: string = 'userOptionId';
	protected readonly optionContentColumnName: string = 'userOptionId';
	protected readonly repositoryConstructor = UserOption;
	protected readonly repositoryOptionConstructor = UserUserOption;
	protected readonly repositoryContentOptionConstructor = UserUserOption;

	constructor(
		@InjectRepository(UserOption) protected readonly repository: Repository<UserOption>,
		@InjectRepository(UserUserOption) public readonly repositoryOption: Repository<UserUserOption>,
		@InjectRepository(UserUserOption) public readonly repositoryContentOption: Repository<UserUserOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
