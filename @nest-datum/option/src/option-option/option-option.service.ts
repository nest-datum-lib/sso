import { Repository } from 'typeorm';
import { SqlService } from '@nest-datum/sql';

export class OptionOptionService extends SqlService {
	protected entityWithTwoStepRemoval = false;
	protected entityOptionId;
	protected entityId;
	protected entityOptionName;

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(),
			[this.entityId]: true,
			[this.entityOptionId]: true,
		});
	}

	protected async createProperties(payload: object): Promise<any> {
		const processedPayload = { ...payload };

		delete payload['entityOptionId'];
		delete payload['entityId'];
		delete payload[this.entityOptionId];
		delete payload[this.entityId];

		return {
			[this.entityOptionId]: processedPayload['entityOptionId'] || processedPayload[this.entityOptionId],
			[this.entityId]: processedPayload['entityId'] || processedPayload[this.entityId],
			...payload,
		};
	}

	protected async createBefore(payload): Promise<any> {
		this.cacheService.clear([ this.entityOptionName, 'many' ]);

		return await super.createBefore(payload);
	}

	protected async updateBefore(payload): Promise<any> {
		this.cacheService.clear([ this.entityOptionName, 'many' ]);

		return await super.updateBefore(payload);
	}
}
