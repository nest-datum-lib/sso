import { SqlService } from '@nest-datum/sql';
import { TransportService } from '../../../@nest-datum/transport/src';
import {
	func as utilsCheckFunc,
	obj as utilsCheckObj,
	arr as utilsCheckArr,
	exists as utilsCheckExists,
	bool as utilsCheckBool,
	strId as utilsCheckStrId,
	strArr as utilsCheckStrArr,
	strName as utilsCheckStrName,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strDataType as utilsCheckStrDataType,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';

export class Controller {
	protected disabledUserId;
	protected exceptionConstructor;
	protected transportService;
	protected entityService;

	async validateMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
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
			accessToken: options['accessToken'],
			userId: user['id'],
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

	async validateOne(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new this.exceptionConstructor(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
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
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
			...utilsCheckObj(options['select']) 
				? { select: options['select'] } 
				: {},
			...utilsCheckObj(options['relations']) 
				? { relations: options['relations'] } 
				: {},
		};
	}

	async validateDrop(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new this.exceptionConstructor(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
		};
	}

	async validateDropMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrArr(options['ids'])) {
			throw new this.exceptionConstructor(`Property "ids" is not valid.`);
		}
		const ids = JSON.parse(options['ids']);

		if (!utilsCheckArr(ids)) {
			throw new this.exceptionConstructor(`Property "ids" is not valid.`);
		}

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			ids,
		};
	}

	async validateCreate(options) {
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);
		const data = {
			description: '',
			regex: '',
		};

		if (!user) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		delete options['user'];

		if (options['id'] && utilsCheckStrId(options['id'])) {
			data['id'] = options['id'];
			delete options['id'];
		}
		if (options['newId'] && utilsCheckStrId(options['newId'])) {
			data['newId'] = options['newId'];
			delete options['newId'];
		}
		if (options['name'] && utilsCheckStrName(options['name'])) {
			data['name'] = options['name'];
			delete options['name'];
		}
		if (options['dataTypeId'] && utilsCheckStrDataType(options['dataTypeId'])) {
			data['dataTypeId'] = options['dataTypeId'];
			delete options['dataTypeId'];
		}
		if (utilsCheckStrDescription(options['description'])) {
			data['description'] = options['description'];
			delete options['description'];
		}
		if (utilsCheckStrRegex(options['regex'])) {
			data['regex'] = options['regex'];
			delete options['regex'];
		}
		if (utilsCheckExists(options['isRequired']) && utilsCheckBool(options['isRequired'])) {
			data['isRequired'] = options['isRequired'];
			delete options['isRequired'];
		}
		if (utilsCheckExists(options['isMultiline']) && utilsCheckBool(options['isMultiline'])) {
			data['isMultiline'] = options['isMultiline'];
			delete options['isMultiline'];
		}
		if (utilsCheckExists(options['isNotDelete']) && utilsCheckBool(options['isNotDelete'])) {
			data['isNotDelete'] = options['isNotDelete'];
			delete options['isNotDelete'];
		}
		if (utilsCheckExists(options['isDeleted']) && utilsCheckBool(options['isDeleted'])) {
			data['isDeleted'] = options['isDeleted'];
			delete options['isDeleted'];
		}
		if (!options['userId']) {
			options['userId'] = user['id'];
		}
		if (this.disabledUserId) {
			options['userId'] = undefined;
			data['userId'] = undefined;
			
			delete options['userId'];
			delete data['userId'];
		}
		return {
			accessToken: options['accessToken'],
			...!this.disabledUserId
				? { userId: user['id'] }
				: {},
			...options,
			...data,
		};
	}

	async log(err) {
		if (!utilsCheckObj(err)
			|| !utilsCheckStrName(err['cmd'])
			|| !utilsCheckFunc(err['getCmd'])
			|| !utilsCheckFunc(err['options'])) {
			console.error(err);
			return;
		}
		this.transportService.sendLog(err);
	}

	async serviceHandlerWrapperDefault() {
	}

	async serviceHandlerWrapper(callback = () => {}) {
		try {
			const output: any = callback
				? (await callback())
				: (await this.serviceHandlerWrapperDefault());

			if (output instanceof Error) {
				throw new this.exceptionConstructor(output.message);
			}
			else if (output instanceof this.exceptionConstructor) {
				throw output;
			}
			return output;
		}
		catch (err) {
			console.log('Controller error: ', err);

			this.log(err);

			throw new this.exceptionConstructor(utilsCheckObj(err['response'])
				&& utilsCheckNumericInt(err['response']['statusCode'])
				? err['response']['message']
				: err.message);
		}
	}
}
