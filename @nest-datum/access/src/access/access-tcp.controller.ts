import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { WarningException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum/controller';
import { 
	strId as utilsCheckStrId,
	strName as utilsCheckStrName, 
} from '@nest-datum-utils/check';

export class AccessTcpController extends TcpController {
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessStatusId'])) {
			throw new WarningException(`Property "accessStatusId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			...(options['accessStatusId'] && utilsCheckStrId(options['accessStatusId'])) 
				? { accessStatusId: options['accessStatusId'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'access.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'access.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('access.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('access.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('access.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('access.update')
	async update(payload: object = {}) {
		return await super.update(payload);
	}
}
