import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '@nest-datum/transport';
import { Controller as NestDatumController } from '@nest-datum-common/controller';
import { 
	bool as utilsCheckBool,
	exists as utilsCheckExists,
	str as utilsCheckStr,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	strEmail as utilsCheckStrEmail,
	strPassword as utilsCheckStrPassword,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strDate as utilsCheckStrDate,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import { AccessService } from './access.service';

@Controller()
export class AccessController extends NestDatumController {
	constructor(
		public transportService: TransportService,
		public service: AccessService,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}) {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessStatusId'])) {
			throw new WarningException(`Property "accessStatusId" is not valid.`);
		}
		return this.validateUpdate(options);
	}

	validateUpdate(options: object = {}): object {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!user) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}

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
			...(options['accessStatusId'] && utilsCheckStrId(options['accessStatusId'])) 
				? { accessStatusId: options['accessStatusId'] } 
				: {},
			...(utilsCheckExists(options['isNotDelete']) && utilsCheckBool(options['isNotDelete'])) 
				? { isNotDelete: options['isNotDelete'] } 
				: {},
			...(utilsCheckExists(options['isDeleted']) && utilsCheckBool(options['isDeleted'])) 
				? { isDeleted: options['isDeleted'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'access.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'access.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('access.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('access.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('access.createOptions')
	async createOptions(payload) {
		return await super.createOptions(payload);
	}

	@EventPattern('access.create')
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

	@EventPattern('access.update')
	async update(payload: object = {}) {
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
