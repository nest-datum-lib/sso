import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { BindTcpController } from '@nest-datum/bind';

export class AccessAccessOptionTcpController extends BindTcpController {
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';
	
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
