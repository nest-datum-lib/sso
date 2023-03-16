import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '@nest-datum/transport';
import { TcpController } from '@nest-datum/controller';
import { 
	strId as utilsCheckStrId,
	strName as utilsCheckStrName, 
} from '@nest-datum-utils/check';
import { RoleService } from './role.service';

@Controller()
export class RoleTcpController extends TcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: RoleService,
	) {
		super();
	}

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleStatusId'])) {
			throw new WarningException(`Property "roleStatusId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			...(options['roleStatusId'] && utilsCheckStrId(options['roleStatusId'])) 
				? { roleStatusId: options['roleStatusId'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'role.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'role.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('role.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('role.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('role.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('role.update')
	async update(payload) {
		return await super.update(payload);
	}
}
