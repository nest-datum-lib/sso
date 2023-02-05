import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionController as NestDatumOptionController } from '@nest-datum/option';
import { UserOptionService } from './user-option.service';

@Controller()
export class UserOptionController extends NestDatumOptionController {
	constructor(
		public transportService: TransportService,
		public service: UserOptionService,
	) {
		super(transportService, service);
	}

	@MessagePattern({ cmd: 'userOption.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'userOption.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('userOption.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('userOption.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('userOption.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('userOption.update')
	async update(payload) {
		return await super.update(payload);
	}
}
