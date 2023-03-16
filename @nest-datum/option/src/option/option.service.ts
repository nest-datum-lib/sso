import { In } from 'typeorm';
import { SqlService } from '@nest-datum/sql';
import { objQueryRunner as utilsCheckObjQueryRunner } from '@nest-datum-utils/check';

export class OptionService extends SqlService {
	protected connection;
	protected cacheService;
	protected entityConstructor;
	protected entityRepository;
	protected entityOptionConstructor;
	protected entityOptionRepository;
	protected entityOptionRelationConstructor;
	protected entityOptionRelationRepository;
	protected entityServicedName;
	protected entityName;
	protected entityId;
	protected entityOptionId;
	protected entityOptionRelationId;
	protected entityWithTwoStepRemoval = true;
	protected withEnvKey = true;

	// constructor(
	// 	protected entityRepository,
	// 	protected entityOptionRepository,
	// 	protected connection,
	// 	protected cacheService,
	// ) {
	// 	super();
	// }

	protected manyGetColumns(customColumns: object = {}) {
		return ({
		...super.manyGetColumns(customColumns),
			userId: true,
			name: true,
			description: true,
			dataTypeId: true,
			defaultValue: true,
			regex: true,
			isMultiline: true,
			isRequired: true,
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

	protected async dropProcessForever(id): Promise<any> {
		this.cacheService.clear([ this.entityName, 'many' ]);
		this.cacheService.clear([ this.entityServicedName, 'many' ]);
		this.cacheService.clear([ this.entityServicedName, 'one' ]);

		if (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true) {
			await this.queryRunner.manager.delete(this.entityOptionConstructor, { [this.entityOptionId]: id });
			await this.queryRunner.manager.delete(this.entityConstructor, id);

			return true;
		}
		await this.entityOptionRepository.delete({ [this.entityOptionId]: id });
		await this.entityRepository.delete({ id });

		return true;
	}

	public async content(payload: object): Promise<any> {
		await this.createQueryRunnerManager();

		try {
			await this.startQueryRunnerManager();
			await this.contentBefore(payload);

			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityServicedName, 'many' ]);
			this.cacheService.clear([ this.entityServicedName, 'one' ]);

			const processedPayload = await this.contentProperties(payload);
			let i = 0,
				ii = 0,
				output = [],
				ids = new Set,
				parentIds = new Set;

			while (i < processedPayload['data'].length) {
				if (processedPayload['data'][i]) {
					ii = 0;

					const option = processedPayload['data'][i];

					while (ii < option.length) {
						ids.add(option[ii]['id']);
						parentIds.add(option[ii]['parentId']);
						ii++;
					}
				}
				i++;
			}
			const idsArr = Array.from(ids);
			const parentIdsArr = Array.from(parentIds);

			const conditionIds = idsArr.map((id, index) => `id = '${id}'${(idsArr.length - 1 > index) ? ' OR ' : ''}`).join('');
			const conditionParentIds = parentIdsArr.map((id, index) => `parentId = '${id}'${(parentIdsArr.length - 1 > index) ? ' OR ' : ''}`).join('');

			const condition = (parentIdsArr.length > 0)
				? `(${conditionIds}) AND (${conditionParentIds})`
				: `${this.entityId} = '${payload['id']}'`;
			
			(utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
				? await this.queryRunner.manager.query(`DELETE FROM ${this.entityOptionRelationRepository.metadata.tableName} WHERE ${condition}`)
				: await this.entityOptionRelationRepository.query(`DELETE FROM ${this.entityOptionRelationRepository.metadata.tableName} WHERE ${condition}`);

			i = 0;
			ii = 0;

			while (i < processedPayload['data'].length) {
				ii = 0;

				const option = processedPayload['data'][i];

				while (ii < option.length) {
					const {
						entityId,
						entityOptionId,
						withNewId,
						...optionData
					} = option[ii];

					if (withNewId === true) {
						delete optionData['id'];
					}
					output.push(await this.contentProcess({
						...optionData,
						[this.entityId]: entityId,
						[this.entityOptionRelationId]: entityOptionId,
					}));
					ii++;
				}
				i++;
			}
			return await this.contentOutput(payload, await this.contentAfter(payload, processedPayload, output));
			return [];
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();
		}
	}

	protected async contentProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async contentBefore(payload: object): Promise<any> {
		return this.before(payload);
	}

	protected async contentProcess(payload: object): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true)
			? await this.queryRunner.manager.save(Object.assign(new this.entityOptionRelationConstructor(), payload))
			: await this.entityOptionRelationRepository.save({ ...payload });
	}

	protected async contentAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return this.after(initialPayload, processedPayload, data);
	}

	protected async contentOutput(payload: object = {}, data: any): Promise<any> {
		return true;
	}
}
