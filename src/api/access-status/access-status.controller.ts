import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusTcpController } from '@nest-datum/status';
import { AccessStatusService } from './access-status.service';

@Controller()
export class AccessStatusController extends StatusTcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: AccessStatusService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'accessStatus.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'accessStatus.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('accessStatus.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('accessStatus.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('accessStatus.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('accessStatus.update')
	async update(payload) {
		return await super.update(payload);
	}
}
