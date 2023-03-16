import { Repository } from 'typeorm';
import { SqlService } from '@nest-datum/sql';

export class StatusService extends SqlService {
	protected withEnvKey = true;
	protected entityWithTwoStepRemoval = true;

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			isNotDelete: true,
			isDeleted: true,
		});
	}

	protected oneGetColumns(customColumns: object = {}) {
		return ({
			...this.manyGetColumns(customColumns),
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
