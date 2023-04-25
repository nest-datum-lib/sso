import { Injectable } from '@nestjs/common';
import { FuseService } from '@nest-datum/fuse';

@Injectable()
export class StatusService extends FuseService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = true;
	protected readonly withCache: boolean = true;

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			userId: true,
			envKey: true,
			name: true,
			description: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			userId: true,
			envKey: true,
			name: true,
			description: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			...super.manyGetQueryColumns(customColumns),
			envKey: true,
			name: true,
			description: true,
		});
	}
}
