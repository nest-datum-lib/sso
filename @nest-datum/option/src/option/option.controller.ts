import getCurrentLine from 'get-current-line';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '../../../transport/src';
import { Controller as NestDatumController } from '../../../../@nest-datum-common/controller/src';
import { 
	bool as utilsCheckBool,
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strDataType as utilsCheckStrDataType,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import { OptionService } from './option.service';

@Controller()
export class OptionController extends NestDatumController {
	constructor(
		public transportService,
		public service,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}): object {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrDataType(options['dataTypeId'])) {
			throw new WarningException(`Property "dataTypeId" is not valid.`);
		}
		return this.validateUpdate(options);
	}

	validateUpdate(options: object = {}): object {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		return {
			userId: user['id'],
			defaultValue: String(options['defaultValue'] ?? ''),
			...(options['id'] && utilsCheckStrId(options['id'])) 
				? { id: options['id'] } 
				: {},
			...(options['newId'] && utilsCheckStrId(options['newId'])) 
				? { newId: options['newId'] } 
				: {},
			...(options['name'] && utilsCheckStrName(options['name'])) 
				? { name: options['name'] } 
				: {},
			...utilsCheckStrDescription(options['description']) 
				? { description: options['description'] } 
				: { description: '' },
			...(options['dataTypeId'] && utilsCheckStrDataType(options['dataTypeId'])) 
				? { dataTypeId: options['dataTypeId'] } 
				: {},
			...utilsCheckStrRegex(options['regex']) 
				? { regex: options['regex'] } 
				: { regex: '' },
			...(utilsCheckExists(options['isRequired']) && utilsCheckBool(options['isRequired'])) 
				? { isRequired: options['isRequired'] } 
				: {},
			...(utilsCheckExists(options['isMultiline']) && utilsCheckBool(options['isMultiline'])) 
				? { isMultiline: options['isMultiline'] } 
				: {},
			...(utilsCheckExists(options['isNotDelete']) && utilsCheckBool(options['isNotDelete'])) 
				? { isNotDelete: options['isNotDelete'] } 
				: {},
			...(utilsCheckExists(options['isDeleted']) && utilsCheckBool(options['isDeleted'])) 
				? { isDeleted: options['isDeleted'] } 
				: {},
		};
	}

	async many(payload) {
		return await super.many(payload);
	}

	async one(payload) {
		return await super.one(payload);
	}

	async drop(payload) {
		return await super.drop(payload);
	}

	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	async create(payload) {
		try {
			const output = await this.service.create(this.validateCreate(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	async update(payload) {
		try {
			await this.service.update(this.validateUpdate(payload));
			
			this.transportService.decrementLoadingIndicator();

			return true;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}
}
