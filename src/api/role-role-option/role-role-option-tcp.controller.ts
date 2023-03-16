import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionOptionTcpController } from '@nest-datum/option';
import { RoleRoleOptionService } from './role-role-option.service';

@Controller()
export class RoleRoleOptionTcpController extends OptionOptionTcpController {
	protected entityId = 'roleId';
	protected entityOptionId = 'roleOptionId';

	constructor(
		protected transportService: TransportService,
		protected entityService: RoleRoleOptionService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'roleOptionRelation.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleOptionRelation.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleOptionRelation.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleOptionRelation.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleOptionRelation.create')
	async create(payload) {
		return await super.create(payload);
	}
}
