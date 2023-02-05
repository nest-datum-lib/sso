import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionService as NestDatumOptionService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessOption } from './access-option.entity';

@Injectable()
export class AccessOptionService extends NestDatumOptionService {
	public entityName = 'accessOption';
	public entityConstructor = AccessOption;

	constructor(
		@InjectRepository(AccessOption) public repository: Repository<AccessOption>,
		@InjectRepository(AccessAccessOption) public repositoryOptionOption: Repository<AccessAccessOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, repositoryOptionOption, connection, cacheService);
	}
}
