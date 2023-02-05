import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusController as NestDatumStatusController } from '@nest-datum/status';
import { RoleStatusService } from './role-status.service';

@Controller()
export class RoleStatusController extends NestDatumStatusController {
	constructor(
		public transportService: TransportService,
		public service: RoleStatusService,
	) {
		super(transportService, service);
	}

	@MessagePattern({ cmd: 'roleStatus.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleStatus.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleStatus.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleStatus.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleStatus.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('roleStatus.update')
	async update(payload) {
		return await super.update(payload);
	}
}
