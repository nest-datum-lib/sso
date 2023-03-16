import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusTcpController } from '@nest-datum/status';
import { UserStatusService } from './user-status.service';

@Controller()
export class UserStatusTcpController extends StatusTcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: UserStatusService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'userStatus.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'userStatus.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('userStatus.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('userStatus.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('userStatus.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('userStatus.update')
	async update(payload) {
		return await super.update(payload);
	}
}
