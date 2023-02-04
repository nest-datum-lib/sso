import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';

@Injectable()
export class OptionOptionService extends SqlService {
	constructor(
		public repository,
		public connection,
		public cacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		// optionId: true,
		// optionOptionId: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
	};

	async drop({ user, ...payload }, withTwoStepRemoval = true): Promise<any> {
		return await super.drop({ user, ...payload }, false);
	}
}
