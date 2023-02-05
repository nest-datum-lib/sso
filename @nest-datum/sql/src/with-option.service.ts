import { CacheService } from '@nest-datum/cache';
import { SqlService } from './sql.service';

export class WithOptionService extends SqlService {
	public connection;
	public cacheService;
	public repository;
	public repositoryOption;
	public repositoryOptionRelation;
	public entityName;
	public entityConstructor;
	public optionRelationConstructor;
	public columnOptionId;
	public optionId;
	public optionOptionId;

	async dropIsDeletedRows(repository, id: string): Promise<any> {
		const entity = await repository.findOne({
			where: {
				id,
			},
		});

		if (entity['isDeleted'] === true) {
			await this.repositoryOption.delete({ [this.columnOptionId]: id });
			await this.repository.delete({ id });
		}
		else {
			await repository.save(Object.assign(new this.entityConstructor(), { id, isDeleted: true }));
		}
		return entity;
	}

	async createOptions(payload: object = {}): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner();

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ this.entityName, 'option', 'many' ]);
			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one' ]);

			await this.repositoryOptionRelation.delete({
				[this.optionId]: payload['id'],
			});

			let i = 0,
				ii = 0;

			while (i < payload['data'].length) {
				ii = 0;

				const option = payload['data'][i];

				while (ii < option.length) {
					const {
						entityOptionId,
						entityId,
						...optionData
					} = option[ii];

					await queryRunner.manager.save(Object.assign(new this.optionRelationConstructor, {
						...optionData,
						[this.optionId]: entityId,
						[this.optionOptionId]: entityOptionId,
					}));
					ii++;
				}
				i++;
			}
			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			throw err;
		}
		finally {
			await queryRunner.release();
		}
	}
}
