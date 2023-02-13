import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionOptionTcpController } from '@nest-datum/option';
import { AccessAccessOptionService } from './access-access-option.service';

@Controller()
export class AccessAccessOptionController extends OptionOptionTcpController {
	protected entityId = 'accessId';
	protected entityOptionId = 'accessOptionId';

	constructor(
		protected transportService: TransportService,
		protected entityService: AccessAccessOptionService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'accessOptionRelation.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'accessOptionRelation.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('accessOptionRelation.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('accessOptionRelation.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('accessOptionRelation.create')
	async create(payload) {
		return await super.create(payload);
	}
}
