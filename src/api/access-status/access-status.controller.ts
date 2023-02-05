import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusController as NestDatumStatusController } from '@nest-datum/status';
import { AccessStatusService } from './access-status.service';

@Controller()
export class AccessStatusController extends NestDatumStatusController {
	constructor(
		public transportService: TransportService,
		public service: AccessStatusService,
	) {
		super(transportService, service);
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
