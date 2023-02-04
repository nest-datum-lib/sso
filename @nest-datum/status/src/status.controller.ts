import getCurrentLine from 'get-current-line';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '../../transport/src';
import { Controller as NestDatumController } from '../../../@nest-datum-common/controller/src';
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
import { StatusService } from './status.service';

@Controller()
export class StatusController extends NestDatumController {
	constructor(
		public transportService,
		public service,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}): object {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
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
			...(utilsCheckExists(options['isNotDelete']) && utilsCheckBool(options['isNotDelete'])) 
				? { isNotDelete: options['isNotDelete'] } 
				: {},
			...(utilsCheckExists(options['isDeleted']) && utilsCheckBool(options['isDeleted'])) 
				? { isDeleted: options['isDeleted'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'status.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'status.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('status.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('status.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('status.create')
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

	@EventPattern('status.update')
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
