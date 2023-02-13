const mergeDeep = require('merge-deep');

import {  
	Not,
	LessThan,
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
	Equal,
	Like,
	ILike,
	Between,
	In,
	Any,
	IsNull,
} from 'typeorm';
import { Repository } from 'typeorm';
import { 
	arr as utilsCheckArr,
	arrFilled as utilsCheckArrFilled, 
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	objQueryRunner as utilsCheckObjQueryRunner,
	numericInt as utilsCheckNumericInt,
	strId as utilsCheckStrId,
} from '@nest-datum-utils/check';
import { loopAsync as utilsLoopAsync } from '@nest-datum-utils/loop';

export class SqlService {
	private operators = {
		'$Not': Not,
		'$LessThan': LessThan,
		'$LessThanOrEqual': LessThanOrEqual,
		'$MoreThan': MoreThan,
		'$MoreThanOrEqual': MoreThanOrEqual,
		'$Equal': Equal,
		'$Like': Like,
		'$ILike': ILike,
		'$Between': Between,
		'$In': In,
		'$Any': Any,
		'$IsNull': IsNull,
	};
	protected connection;
	protected cacheService;
	protected entityRepository;
	protected entityConstructor;
	protected entityName;
	protected entityWithTwoStepRemoval = true;
	protected enableTransactions = true;
	protected listSortByDefault = { createdAt: 'DESC' };
	protected queryRunner;

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			id: true,
			createdAt: true,
			updatedAt: true,
		});
	}

	protected oneGetColumns(customColumns: object = {}) {
		return ({
			id: true,
			createdAt: true,
			updatedAt: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			id: true,
		});
	}

	protected existsInManyGetColumns(columnName: string): boolean {
		return this.manyGetColumns()[columnName] === true;
	}

	protected existsInOneGetColumns(columnName: string): boolean {
		return this.oneGetColumns()[columnName] === true;
	}

	protected existsInManyGetQueryColumns(columnName: string): boolean {
		return this.manyGetQueryColumns()[columnName] === true;
	}

	protected where(filter: object = {}, where: object = {}): object {
		let key;

		for (key in filter) {
			let i = 0,
				filterKey = key,
				filterValue = filter[key];

			if (utilsCheckArr(filterValue)) {
				where[filterKey] = (this.operators[filterValue[0]])
					? this.operators[filterValue[0]]((this.operators[filterValue[1]])
						? this.operators[filterValue[1]](filterValue.slice(2))
						: filterValue.slice(1))
					: filterValue;
			}
			else if (utilsCheckObj(filterValue)) {
				where[filterKey] = this.where(filterValue);
			}
			else {
				where[filterKey] = filterValue;
			}
		}
		return where;
	}

	protected queryDeep(query: string = '', querySelect = {}, where: object = {}) {
		let key;

		for (key in querySelect) {
			where[key] = utilsCheckObjFilled(querySelect[key])
				? this.queryDeep(query, querySelect[key])
				: Like(`%${query}%`);
		}
		return where;
	}

	protected query(query: string = '', querySelect = {}, where: Array<any> = []): Array<any> {
		let key;

		for (key in querySelect) {
			where.push({ 
				[key]: utilsCheckObjFilled(querySelect[key])
					? this.queryDeep(querySelect[key], query)
					: Like(`%${query}%`), 
			});
		}
		return where;
	}

	protected relationsByFilter(filter: object = {}, collect: object = {}) {
		let key;

		for (key in filter) {
			let i = 0,
				filterKey = key,
				filterValue = filter[key];

			if (utilsCheckObj(filterValue)) {
				let childKey,
					childFlag = false;

				for (childKey in filterValue) {
					if (utilsCheckObj(filterValue[childKey])) {
						childFlag = true;
						break;
					}
				}
				collect[filterKey] = childFlag
					? this.relationsByFilter(filterValue)
					: true;
			}
		}
		return collect;
	}

	protected relations(data?: object, filter: object = {}): object {
		const relationsByFilter = this.relationsByFilter(filter);

		if (utilsCheckObj(data)) {
			return mergeDeep(relationsByFilter || {}, data);
		}
		return relationsByFilter;
	}

	protected pagination(page: number, limit: number): object {
		const limitProcessed = utilsCheckNumericInt(limit) ? limit : 0;

		const skip = (page > 0)
			? ((page - 1) * limitProcessed)
			: 0;

		return {
			skip,
			...utilsCheckNumericInt(limitProcessed)
				? { take: limitProcessed }
				: {},
		};
	}

	protected order(sort: object = {}): object {
		return utilsCheckObjFilled(sort)
			? sort
			: (this.manyGetColumns()['createdAt']
				? { createdAt: 'DESC' }
				: {});
	}

	protected async findMany({ page = 1, limit = 20, query, filter, sort, relations }: { page?: number; limit?: number; query?: string; filter?: object; sort?: object; relations?: object }): Promise<any> {
		const relationsProcessed = this.relations(relations, filter);
		const whereProcessed = this.where(filter);
		const order = this.order(sort);
		let where;

		if (query) {
			where = this.query(query, this.manyGetQueryColumns());
			where = where.map((item) => ({
				...item,
				...whereProcessed,
			}));
		}
		return {
			select: this.manyGetColumns(),
			...utilsCheckObjFilled(relationsProcessed)
				? { relations: relationsProcessed }
				: {},
			...(utilsCheckArrFilled(where)
				|| utilsCheckObjFilled(whereProcessed))
				? { where: where || whereProcessed }
				: {},
			...utilsCheckObjFilled(order)
				? { order }
				: {},
			...this.pagination(page, limit),
		};
	}

	protected async findOne(options?: object): Promise<any> {
		const id = options['id'];
		const relations = options['relations'];
		const filter = { id };
		const relationsProcessed = this.relations(relations, filter);
		const where = this.where(filter);

		return {
			select: this.oneGetColumns(),
			...(Object.keys(relationsProcessed).length > 0)
				? { relations: relationsProcessed }
				: {},
			...(Object.keys(where).length > 0)
				? { where }
				: {},
		};
	}

	protected async before(payload): Promise<any> {
	}

	protected async after(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		await this.commitQueryRunnerManager();

		return data;
	}

	public async many(payload): Promise<any> {
		await this.manyBefore(payload);

		const cachedData = await this.cacheService.get([ this.entityName, 'many', payload ]);

		if (cachedData) {
			return cachedData;
		}
		const processedPayload = await this.manyProperties(payload);
		const many = await this.entityRepository.findAndCount(await this.findMany(processedPayload));
		const output = {
			rows: many[0],
			total: many[1],
		};

		await this.cacheService.set([ this.entityName, 'many', payload ], JSON.stringify(output));
		
		return await this.manyOutput(processedPayload, await this.manyAfter(payload, processedPayload, output));
	}

	protected async manyProperties(payload: object): Promise<any> {
		return await this.manySortByDefault(payload);
	}

	protected async manySortByDefault(payload: object) {
		if (!payload['sort'] && this.existsInManyGetQueryColumns('createdAt')) {
			payload['sort'] = this.listSortByDefault;
		}
		return payload;
	}

	protected async manyBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async manyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async manyOutput(payload: object, data: any): Promise<any> {
		return data;
	}

	public async one(payload): Promise<any> {
		await this.oneBefore(payload);

		const cachedData = await this.cacheService.get([ this.entityName, 'one', payload ]);

		if (cachedData) {
			return cachedData;
		}
		const processedPayload = await this.oneProperties(payload);
		const output = await this.entityRepository.findOne(await this.findOne(processedPayload));
		
		if (output) {
			await this.cacheService.set([ this.entityName, 'one', payload ], JSON.stringify(output));
		}
		if (!output) {
			return new Error('Entity is undefined.');
		}
		return await this.oneOutput(processedPayload, await this.oneAfter(payload, processedPayload, output));
	}

	protected async oneProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async oneBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async oneAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async oneOutput(payload: object, data: any): Promise<any> {
		return data;
	}

	protected async createQueryRunnerManager(): Promise<any> {
		return (this.queryRunner = await this.connection.createQueryRunner());
	}

	protected async startQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true) {
			await this.queryRunner.startTransaction();
		}
	}

	protected async commitQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true) {
			await this.queryRunner.commitTransaction();
		}
	}

	protected async rollbackQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true) {
			await this.queryRunner.rollbackTransaction();
		}
	}

	protected async dropQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) 
			&& this.enableTransactions === true) {
			await this.queryRunner.release();
			this.queryRunner = undefined;
		}
		return true;
	}

	public async update(payload: object = {}): Promise<any> {
		await this.createQueryRunnerManager();

		try {
			await this.startQueryRunnerManager();
			await this.updateBefore(payload);

			const newId = utilsCheckStrId(payload['newId']) && payload['newId'];

			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one' ]);

			const processedPayload = await this.updateProperties({ 
				...payload, 
				...newId
					? { id: newId }
					: {},
			});
			const output = await this.updateProcess(processedPayload);

			return await this.updateOutput(processedPayload, await this.updateAfter(payload, processedPayload, output));
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();

		}
	}

	protected async updateProperties(payload: object): Promise<any> {
		delete payload['accessToken'];
		delete payload['refreshToken'];
		delete payload['newId'];

		return payload;
	}

	protected async updateBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async updateProcess(payload: object): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
			? await this.queryRunner.manager.update(this.entityConstructor, payload['id'], payload)
			: await this.entityRepository.update({ id: payload['id'] }, payload);
	}

	protected async updateAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async updateOutput(payload: object, data: any): Promise<any> {
		return true;
	}

	public async create(payload: object = {}): Promise<any> {
		await this.createQueryRunnerManager();
		
		try {
			await this.startQueryRunnerManager();
			await this.createBefore(payload);
		
			this.cacheService.clear([ this.entityName, 'many' ]);

			const processedPayload = await this.createProperties(payload);
			const output = await this.createProcess(processedPayload);

			return await this.createOutput(processedPayload, await this.createAfter(payload, processedPayload, output));
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();
		}
	}

	protected async createProperties(payload: object): Promise<any> {
		delete payload['accessToken'];
		delete payload['refreshToken'];

		return payload;
	}

	protected async createBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async createProcess(payload: object): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
			? await this.queryRunner.manager.save(Object.assign(new this.entityConstructor(), payload))
			: await this.entityRepository.save(payload);
	}

	protected async createAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async createOutput(payload: object, data: any): Promise<any> {
		return data;
	}

	public async drop(payload): Promise<any> {
		await this.createQueryRunnerManager();
		
		try {
			await this.startQueryRunnerManager();
			await this.dropBefore(payload);

			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one', payload ]);

			const processedPayload = await this.dropProperties(payload);
			let entityOrId = processedPayload['id'];

			if (this.entityWithTwoStepRemoval) {
				entityOrId = await this.entityRepository.findOne({
					where: {
						id: processedPayload['id'],
					},
				});
			}
			const output = await this.dropProcess(entityOrId);

			return await this.dropOutput(processedPayload, await this.dropAfter(payload, processedPayload, output));
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();

		}
	}

	protected async dropProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async dropBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async dropProcess(entityOrId): Promise<any> {
		if (!this.entityWithTwoStepRemoval) {
			return await this.dropProcessForever(entityOrId);
		}
		let id = String(entityOrId),
			entity = entityOrId;

		if (utilsCheckObj(entityOrId)) {
			id = (entityOrId || {})['id'];
		}
		if (!utilsCheckObj(entityOrId)) {
			entity = await this.entityRepository.findOne({
				select: {
					id: true,
					isDeleted: true,
				},
				where: {
					id,
				},
			});
		}

		entity.isDeleted
			? await this.dropProcessForever(id)
			: await this.dropProcessPrepare(id);

		return entity;
	}

	protected async dropProcessForever(id): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
			? await this.queryRunner.manager.delete(this.entityConstructor, id)
			: await this.entityRepository.delete({ id });
	}

	protected async dropProcessPrepare(id: string): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
			? await this.queryRunner.manager.save(Object.assign(new this.entityConstructor(), { id, isDeleted: true }))
			: await this.entityRepository.save({ id, isDeleted: true });
	}

	protected async dropAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropOutput(payload: object, data: any): Promise<any> {
		return true;
	}

	public async dropMany(payload): Promise<any> {
		await this.createQueryRunnerManager();
		
		try {
			await this.startQueryRunnerManager();
			await this.dropManyBefore(payload);

			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one', payload ]);

			const processedPayload = await this.dropManyProperties(payload);
			const output = await this.dropManyProcess(payload['ids']);

			return await this.dropManyOutput(processedPayload, await this.dropManyAfter(payload, processedPayload, output));
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();

		}
	}

	protected async dropManyProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async dropManyBefore(payload): Promise<any> {
		return await this.before(payload);
	}

	protected async dropManyProcess(ids: Array<string>): Promise<any> {
		if (!this.entityWithTwoStepRemoval) {
			return await this.dropManyProcessForever(ids);
		}
		return await utilsLoopAsync(ids, (async (id) => {
			const entity = await this.entityRepository.findOne({
				select: {
					id: true,
					isDeleted: true,
				},
				where: {
					id,
				},
			});

			return entity.isDeleted
				? await this.dropProcessForever(entity.id)
				: await this.dropProcessPrepare(entity.id);
		}));
	}

	protected async dropManyProcessForever(idsArrOrId): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) 
				&& this.enableTransactions === true)
			? await this.queryRunner.manager.delete(this.entityConstructor, idsArrOrId)
			: await this.entityRepository.delete(utilsCheckStrId(idsArrOrId) ? { id: idsArrOrId } : idsArrOrId);
	}

	protected async dropManyProcessPrepare(id: string): Promise<any> {
		return this.dropProcessPrepare(id);
	}

	protected async dropManyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropManyOutput(payload: object, data: any): Promise<any> {
		return true;
	}
}
