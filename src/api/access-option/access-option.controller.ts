import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionController as NestDatumOptionController } from '@nest-datum/option';
import { AccessOptionService } from './access-option.service';

@Controller()
export class AccessOptionController extends NestDatumOptionController {
	constructor(
		public transportService: TransportService,
		public service: AccessOptionService,
	) {
		super(transportService, service);
	}

	@MessagePattern({ cmd: 'accessOption.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'accessOption.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('accessOption.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('accessOption.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('accessOption.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('accessOption.update')
	async update(payload) {
		return await super.update(payload);
	}
}
