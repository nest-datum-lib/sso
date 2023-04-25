import { Injectable } from '@nestjs/common';
import { ManyService } from '@nest-datum/many';

@Injectable()
export class OptionService extends ManyService {
	protected readonly withEnvKey: boolean = true;
	protected readonly withTwoStepRemoval: boolean = true;

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			defaultValue: true,
			regex: true,
			isMultiline: true,
			isRequired: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			defaultValue: true,
			regex: true,
			isMultiline: true,
			isRequired: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			...super.manyGetQueryColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			defaultValue: true,
			regex: true,
			isMultiline: true,
			isRequired: true,
		});
	}
}
