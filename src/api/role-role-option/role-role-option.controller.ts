import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionOptionController as NestDatumOptionOptionController } from '@nest-datum/option';
import { RoleRoleOptionService } from './role-role-option.service';

@Controller()
export class RoleRoleOptionController extends NestDatumOptionOptionController {
	constructor(
		public transportService: TransportService,
		public service: RoleRoleOptionService,
	) {
		super(transportService, service, 'roleId', 'roleOptionId');
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
