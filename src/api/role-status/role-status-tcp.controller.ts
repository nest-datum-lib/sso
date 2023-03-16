import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusTcpController } from '@nest-datum/status';
import { RoleStatusService } from './role-status.service';

@Controller()
export class RoleStatusTcpController extends StatusTcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: RoleStatusService,
	) {
		super();
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
