import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService as NestDatumOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserOption } from './user-option.entity';

@Injectable()
export class UserOptionService extends NestDatumOptionService {
	public entityName = 'userOption';
	public entityColumnOption = 'userOptionId';
	public entityConstructor = UserOption;

	constructor(
		@InjectRepository(UserOption) public repository: Repository<UserOption>,
		@InjectRepository(UserUserOption) public repositoryOptionOption: Repository<UserUserOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, repositoryOptionOption, connection, cacheService);
	}
}
