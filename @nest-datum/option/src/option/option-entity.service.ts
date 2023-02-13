import { SqlService } from '@nest-datum/sql';
import { objQueryRunner as utilsCheckObjQueryRunner } from '@nest-datum-utils/check';

export class OptionEntityService extends SqlService {
	protected entityName;
	protected entityRepository;
	protected entityConstructor;
	protected entityOptionRepository;
	protected entityOptionConstructor;
	protected entityId;
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
}
