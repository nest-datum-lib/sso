import { Injectable } from '@nestjs/common';
import { MainService } from '@nest-datum/main';
import { objQueryRunner as utilsCheckObjQueryRunner } from '@nest-datum-utils/check';

@Injectable()
export class AccessService extends MainService {
	protected readonly queryRunner;
	protected readonly repository;
	protected readonly repositoryBindOption;
	protected readonly repositoryRoleAccess;
	protected readonly repositoryConstructor;
	protected readonly repositoryBindOptionConstructor;
	protected readonly repositoryRoleAccessConstructor;
	protected readonly withEnvKey: boolean = true;
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			userId: true,
			accessStatusId: true,
			name: true,
			description: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			userId: true,
			accessStatusId: true,
			name: true,
			description: true,
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
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.manager.delete(this.repositoryBindOptionConstructor, { [this.mainRelationColumnName]: id });
			await this.queryRunner.manager.delete(this.repositoryRoleAccessConstructor, { [this.mainRelationColumnName]: id });
			await this.queryRunner.manager.delete(this.repositoryConstructor, id);

			return true;
		}
		await this.repositoryBindOption.delete({ [this.mainRelationColumnName]: id });
		await this.repositoryRoleAccess.delete({ [this.mainRelationColumnName]: id });
		await this.repository.delete({ id });

		return true;
	}
}
