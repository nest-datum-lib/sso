import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { 
	ErrorException,
	WarningException, 
	NotFoundException,
} from '@nest-datum-common/exceptions';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import {
	encryptPassword,
	generateVerifyKey,
	generateTokens,
	checkPassword,
} from '@nest-datum/jwt';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { Access } from './access.entity';

@Injectable()
export class AccessService extends SqlService {
	public entityName = 'access';
	public entityConstructor = Access;
	public optionRelationConstructor = AccessAccessAccessOption;
	public optionId = 'accessId';
	public optionOptionId = 'accessAccessOptionId';

	constructor(
		@InjectRepository(Access) public repository: Repository<Access>,
		@InjectRepository(AccessAccessAccessOption) public repositoryOptionRelation: Repository<AccessAccessAccessOption>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		accessStatusId: true,
		name: true,
		description: true,
		isDeleted: true,
		isNotDelete: true,
		createdAt: true,
		updatedAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		name: true,
		description: true,
	};
}
