import { Controller as NestjsController } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { SqlService } from '@nest-datum/sql';
import { TransportService } from '../../../@nest-datum/transport/src';
import {
	func as utilsCheckFunc,
	obj as utilsCheckObj,
	strId as utilsCheckStrId,
	strDescription as utilsCheckStrDescription,
	numericInt as utilsCheckNumericInt,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';

@NestjsController()
export class Controller {
	constructor(
		public transportService,
		public service,
	) {
	}

	validateMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		try {
			options['select'] = JSON.parse(options['select']);
		}
		catch (err) {
		}
		try {
			options['relations'] = JSON.parse(options['relations']);
		}
		catch (err) {
		}
		try {
			options['sort'] = JSON.parse(options['sort']);
		}
		catch (err) {
		}
		try {
			options['filter'] = JSON.parse(options['filter']);
		}
		catch (err) {
		}
		return {
			user,
			...utilsCheckNumericInt(options['page'])
				? { page: Number(options['page'] || 1) }
				: { page: 1 },
			...utilsCheckNumericInt(options['limit'])
				? { limit: Number(options['limit'] || 20) }
				: { limit: 20 },
			...utilsCheckObj(options['select']) 
				? { select: options['select'] } 
				: {},
			...utilsCheckObj(options['relations']) 
				? { relations: options['relations'] } 
				: {},
			...utilsCheckObj(options['sort']) 
				? { sort: options['sort'] } 
				: {},
			...utilsCheckObj(options['filter']) 
				? { filter: options['filter'] } 
				: {},
			...utilsCheckStrDescription(options['query']) 
				? { query: options['query'] } 
				: {},
		};
	}

	validateOne(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new WarningException(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		try {
			options['select'] = JSON.parse(options['select']);
		}
		catch (err) {
		}
		try {
			options['relations'] = JSON.parse(options['relations']);
		}
		catch (err) {
		}
		return {
			user,
			id: options['id'],
			...utilsCheckObj(options['select']) 
				? { select: options['select'] } 
				: {},
			...utilsCheckObj(options['relations']) 
				? { relations: options['relations'] } 
				: {},
		};
	}

	validateDrop(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new WarningException(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		return {
			user,
			id: options['id'],
		};
	}

	validateDropMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		return {
			user,
			ids: JSON.parse(options['ids']),
		};
	}

	validateOptions(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new WarningException(`Property "id" is nt valid.`);
		}
		try {
			options['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (!utilsCheckArr(options['data'])) {
			throw new WarningException(`Property "data" is nt valid.`);
		}

		return {
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	async log(err) {
		if (!utilsCheckObj(err)
			|| !utilsCheckFunc(err['getCmd'])
			|| !utilsCheckFunc(err['options'])) {
			console.error(err);
			return;
		}
		this.transportService.sendLog(err);
	}

	async many(payload) {
		try {
			const many = await this.service.many(this.validateMany(payload));

			this.transportService.decrementLoadingIndicator();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	async one(payload) {
		try {
			const output = await this.service.one(this.validateOne(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	async drop(payload) {
		try {
			await this.service.drop(this.validateDrop(payload));
			
			this.transportService.decrementLoadingIndicator();

			return true;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	async dropMany(payload) {
		try {
			await this.service.dropMany(this.validateDropMany(payload));

			this.transportService.decrementLoadingIndicator();

			return true;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	async createOptions(payload) {
		try {
			const output = await this.service.createOptions(this.validateOptions(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}
}
