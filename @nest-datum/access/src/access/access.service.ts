import { Injectable } from '@nestjs/common';
import { OptionEntityService } from '@nest-datum/option';
import { CacheService } from '@nest-datum/cache';

export class AccessService extends OptionEntityService {
	protected withEnvKey = true;
	protected entityName = 'access';
	protected entityOptionId = 'accessOptionId';
	protected entityId = 'accessId';
	protected entityConstructor;
	protected entityOptionConstructor;

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
