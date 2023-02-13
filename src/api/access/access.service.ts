import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { OptionEntityService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';

@Injectable()
export class AccessService extends OptionEntityService {
	protected entityName = 'access';
	protected entityConstructor = Access;
	protected entityOptionConstructor = AccessAccessOption;
	protected entityId = 'accessId';

	constructor(
		@InjectRepository(Access) protected entityRepository: Repository<Access>,
		@InjectRepository(AccessAccessOption) protected entityOptionRepository: Repository<AccessAccessOption>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			userId: true,
			accessStatusId: true,
			name: true,
			description: true,
			isDeleted: true,
			isNotDelete: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
		...super.manyGetQueryColumns(customColumns),
			name: true,
			description: true,
		});
	}
}
