import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { CacheService } from '@nest-datum/cache';
import { ManyService } from '@nest-datum/many';
import { UserUserOption } from './user-user-option.entity';

@Injectable()
export class UserUserOptionService extends ManyService {
	protected readonly mainRelationColumnName: string = 'userId';
	protected readonly optionRelationColumnName: string = 'userUserOptionId';
	protected readonly repositoryConstructor = UserUserOption;

	constructor(
		@InjectRepository(UserUserOption) protected readonly repository: Repository<UserUserOption>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
