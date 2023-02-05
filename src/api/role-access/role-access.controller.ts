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
import { RoleAccessService } from './role-access.service';

@Controller()
export class RoleAccessController extends NestDatumController {
	constructor(
		public transportService: TransportService,
		public service: RoleAccessService,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}) {
		if (!utilsCheckStrId(options['roleId'])) {
			throw new WarningException(`Property "roleId" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessId'])) {
			throw new WarningException(`Property "accessId" is not valid.`);
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
			...(options['roleId'] && utilsCheckStrId(options['roleId'])) 
				? { roleId: options['roleId'] } 
				: {},
			...(options['accessId'] && utilsCheckStrId(options['accessId'])) 
				? { accessId: options['accessId'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'roleAccess.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleAccess.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleAccess.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleAccess.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleAccess.create')
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
}
