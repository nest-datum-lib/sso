import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { OptionTcpController } from '@nest-datum/option';

export class AccessOptionTcpController extends OptionTcpController {
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

	@EventPattern('access.content')
	async content(payload) {
		return await super.content(payload);
	}

	@EventPattern('access.contentUpdate')
	async contentUpdate(payload) {
		return await super.contentUpdate(payload);
	}
}
