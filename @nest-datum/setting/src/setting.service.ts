import { Repository } from 'typeorm';
import { SqlService } from '@nest-datum/sql';

export class SettingService extends SqlService {
	protected entityName = 'setting';
	protected entityWithTwoStepRemoval = true;

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			value: true,
			regex: true,
			isDeleted: true,
			isNotDelete: true,
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
