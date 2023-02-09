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
import { 
	Repository,
	Connection, 
} from 'typeorm';
import {
	NotFoundException,
	ErrorException,
} from '@nest-datum-common/exceptions';
import { 
	arr as utilsCheckArr,
	arrFilled as utilsCheckArrFilled, 
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	numericInt as utilsCheckNumericInt,
	strId as utilsCheckStrId,
} from '@nest-datum-utils/check';
import { CacheService } from '@nest-datum/cache';

export class SqlService {
	protected operators = {
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
	protected selectDefaultMany;
	protected queryDefaultMany;
	public connection;
	public cacheService;
	public repository;
	public repositoryOptionRelation;
	public entityName;
	public entityConstructor;
	public optionRelationConstructor;
	public optionId;
	public optionOptionId;

	where(filter: object = {}, where: object = {}): object {
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

	queryDeep(query: string = '', querySelect = {}, where: object = {}) {
		let key;

		for (key in querySelect) {
			where[key] = utilsCheckObjFilled(querySelect[key])
				? this.queryDeep(query, querySelect[key])
				: Like(`%${query}%`);
		}
		return where;
	}

	query(query: string = '', querySelect = {}, where: Array<any> = []): Array<any> {
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

	relationsByFilter(filter: object = {}, collect: object = {}) {
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

	relations(data?: object, filter: object = {}): object {
		const relationsByFilter = this.relationsByFilter(filter);

		if (utilsCheckObj(data)) {
			return mergeDeep(relationsByFilter || {}, data);
		}
		return relationsByFilter;
	}

	pagination(page: number, limit: number): object {
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

	order(sort: object = {}): object {
		return utilsCheckObjFilled(sort)
			? sort
			: ((this.selectDefaultMany || {})['createdAt']
				? { createdAt: 'DESC' }
				: {});
	}

	async findMany({ page = 1, limit = 20, query, filter, sort, relations }: { page?: number; limit?: number; query?: string; filter?: object; sort?: object; relations?: object }): Promise<any> {
		const relationsProcessed = this.relations(relations, filter);
		const whereProcessed = this.where(filter);
		const order = this.order(sort);
		let where;

		if (query) {
			where = this.query(query, this.queryDefaultMany);
			where = where.map((item) => ({
				...item,
				...whereProcessed,
			}));
		}
		return {
			select: this.selectDefaultMany,
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

	async findOne(options?: object): Promise<any> {
		const id = options['id'];
		const relations = options['relations'];
		const filter = { id };
		const relationsProcessed = this.relations(relations, filter);
		const where = this.where(filter);

		return {
			select: this.selectDefaultMany,
			...(Object.keys(relationsProcessed).length > 0)
				? { relations: relationsProcessed }
				: {},
			...(Object.keys(where).length > 0)
				? { where }
				: {},
		};
	}

	async drop({ user, ...payload }, withTwoStepRemoval = true): Promise<any> {
		this.cacheService.clear([ this.entityName, 'many' ]);
		this.cacheService.clear([ this.entityName, 'one', payload ]);

		(withTwoStepRemoval)
			? await this.dropIsDeletedRows(this.repository, payload['id'])
			: await this.repository.delete({ id: payload['id'] });

		return true;
	}

	async dropMany({ user, ...payload }, withTwoStepRemoval = true): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ this.entityName, 'many' ]);
			this.cacheService.clear([ this.entityName, 'one', payload ]);

			let i = 0;

			if (withTwoStepRemoval) { 
				while (i < payload['ids'].length) {
					await this.dropIsDeletedRows(queryRunner.manager, payload['ids'][i]);
					i++;
				}
			}
			else {
				while (i < payload['ids'].length) {
					queryRunner.manager.delete(this.entityConstructor, { id: payload['ids'][i] });
					i++;
				}
			}
			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			throw new ErrorException(err.message);
		}
		finally {
			await queryRunner.release();
		}
	}

	async dropIsDeletedRows(repository, id: string): Promise<any> {
		const entity = await repository.findOne({
			where: {
				id,
			},
		});

		(entity['isDeleted'] === true)
			? await this.repository.delete({ id })
			: await repository.save(Object.assign(new this.entityConstructor(), { id, isDeleted: true }));
		return entity;
	}

	async createProps (payload) {
		return payload;
	}

	async create(payload: object = {}): Promise<any> {
		delete payload['accessToken'];
		delete payload['refreshToken'];
		
		this.cacheService.clear([ this.entityName, 'many' ]);

		return await this.repository.save(await this.createProps({
			...payload,
			...payload['userId']
				? { userId: payload['userId'] }
				: {},
		}));
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

	async update(payload: object = {}): Promise<any> {
		const newId = utilsCheckStrId(payload['newId']) && payload['newId'];

		delete payload['accessToken'];
		delete payload['refreshToken'];
		delete payload['newId'];

		this.cacheService.clear([ this.entityName, 'many' ]);
		this.cacheService.clear([ this.entityName, 'one' ]);

		await this.repository.update({ id: payload['id'] }, {
			...await this.createProps({ ...payload }),
			...newId
				? { id: newId }
				: {},
		});

		return true;
	}

	async one({ user, ...payload }): Promise<any> {
		const cachedData = await this.cacheService.get([ this.entityName, 'one', payload ]);

		if (cachedData) {
			return cachedData;
		}
		const output = await this.repository.findOne(await this.findOne(payload));
		
		if (output) {
			await this.cacheService.set([ this.entityName, 'one', payload ], JSON.stringify(output));
		}
		if (!output) {
			return new NotFoundException('Entity is undefined');
		}
		return output;
	}

	async many({ user, ...payload }): Promise<any> {
		const cachedData = await this.cacheService.get([ this.entityName, 'many', payload ]);

		if (cachedData) {
			return cachedData;
		}
		if (!payload['sort'] && this.selectDefaultMany['createdAt']) {
			payload['sort'] = { createdAt: 'DESC' };
		}
		const output = await this.repository.findAndCount(await this.findMany(payload));

		await this.cacheService.set([ this.entityName, 'many', payload ], JSON.stringify(output));

		return output;
	}
}
