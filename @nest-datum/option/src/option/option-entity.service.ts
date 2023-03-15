import { SqlService } from '@nest-datum/sql';
import { 
	obj as utilsCheckObj,
	objQueryRunner as utilsCheckObjQueryRunner, 
} from '@nest-datum-utils/check';

export class OptionEntityService extends SqlService {
	protected entityName;
	protected entityRepository;
	protected entityConstructor;
	protected entityOptionRepository;
	protected entityOptionConstructor;
	protected entityId;
	protected entityOptionId;
	protected enableTransactions;
	protected queryRunnerManager;

	protected oneGetColumns(customColumns: object = {}) {
		return ({
			...this.manyGetColumns(customColumns),
		});
	}

	protected async dropProcessForever(id): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunnerManager) 
			&& this.enableTransactions === true) {
			await this.queryRunnerManager.manager.delete(this.entityOptionConstructor, { [this.entityId]: id });
			await this.queryRunnerManager.manager.delete(this.entityConstructor, id);

			return true;
		}
		await this.entityOptionRepository.delete({ [this.entityId]: id });
		await this.entityRepository.delete({ id });

		return true;
	}

	protected async findMany({ page = 1, limit = 20, query, filter, sort, relations }: { page?: number; limit?: number; query?: string; filter?: object; sort?: object; relations?: object }): Promise<any> {
		if (utilsCheckObj(filter) && utilsCheckObj(filter['custom'])) {
			const optionId = filter['custom']['disableForOption'];
			const queryRunner = await this.connection.createQueryRunner();
			const types = await queryRunner.query(`SELECT ${this.entityId} FROM ${this.entityOptionRepository.metadata.tableName} WHERE ${this.entityOptionId} = '${optionId}' GROUP BY ${this.entityId}`);

			delete filter['custom'];

			if (types.length > 0) {
				filter['id'] = [ '$Not', ...types.map((item) => item[this.entityId]) ];
			}
		}
		return await super.findMany({ page, limit, query, filter, sort, relations });
	}
}
