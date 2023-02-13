import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TcpController as NestDatumTcpController } from '../../controller/src';
import { strName as utilsCheckStrName } from '@nest-datum-utils/check';

@Controller()
export class StatusTcpController extends NestDatumTcpController {
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	@MessagePattern({ cmd: 'status.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'status.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('status.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('status.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('status.create')
	async create(payload: object = {}) {
		return await super.create(payload);
	}

	@EventPattern('status.update')
	async update(payload: object = {}) {
		return await super.update(payload);
	}
}
