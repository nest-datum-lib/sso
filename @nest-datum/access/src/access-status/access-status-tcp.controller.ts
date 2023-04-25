import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { StatusTcpController } from '@nest-datum/status';

export class AccessStatusTcpController extends StatusTcpController {
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
