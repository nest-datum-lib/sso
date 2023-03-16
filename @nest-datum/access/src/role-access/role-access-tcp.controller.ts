import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { WarningException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum/controller';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class RoleAccessTcpController extends TcpController {
	async validateCreate(options) {
		if (!utilsCheckStrId(options['roleId'])) {
			throw new WarningException(`Property "roleId" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessId'])) {
			throw new WarningException(`Property "accessId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			...(options['roleId'] && utilsCheckStrId(options['roleId'])) 
				? { roleId: options['roleId'] } 
				: {},
			...(options['accessId'] && utilsCheckStrId(options['accessId'])) 
				? { accessId: options['accessId'] } 
				: {},
		};
	}

	@MessagePattern({ cmd: 'roleAccess.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleAccess.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleAccess.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleAccess.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleAccess.create')
	async create(payload) {
		return await super.create(payload);
	}
}
