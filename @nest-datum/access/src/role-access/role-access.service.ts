import { BindService } from '@nest-datum/bind';

export class RoleAccessService extends BindService {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'accessId';
	protected readonly withEnvKey: boolean = false;

	protected manyGetColumns(customColumns: object = {}): object {
		const output = super.manyGetColumns(customColumns);

		delete output['isDeleted'];
		delete output['isNotDelete'];

		return output;
	}

	protected oneGetColumns(customColumns: object = {}): object {
		const output = super.oneGetColumns(customColumns);

		delete output['isDeleted'];
		delete output['isNotDelete'];

		return output;
	}

	protected manyGetQueryColumns(customColumns: object = {}): object {
		const output = super.manyGetQueryColumns(customColumns);

		delete output['isDeleted'];
		delete output['isNotDelete'];

		return output;
	}
}
