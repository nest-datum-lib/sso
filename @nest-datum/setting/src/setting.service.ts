import { Injectable } from '@nestjs/common';
import { FuseService } from '@nest-datum/fuse';

@Injectable()
export class SettingService extends FuseService {
	protected readonly withEnvKey: boolean = true;
	protected readonly withTwoStepRemoval: boolean = true;

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			value: true,
			regex: true,
		};
	}

	protected manyGetQueryColumns(customColumns: object = {}): object {
		return {
			...super.manyGetQueryColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			value: true,
			regex: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return {
			...super.oneGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			value: true,
			regex: true,
		};
	}
}
