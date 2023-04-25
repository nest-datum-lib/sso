import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
} from '@nest-datum-utils/check';

export class RoleAccessTcpController extends TcpController {
	async validateCreate(options) {
		if (!utilsCheckStrId(options['roleId'])) {
			throw new MethodNotAllowedException(`Property "roleId" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessId'])) {
			throw new MethodNotAllowedException(`Property "accessId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckExists(options['roleId'])) {
			if (!utilsCheckStrId(options['roleId'])) {
				throw new MethodNotAllowedException(`Property "roleId" is not valid.`);
			}
			output['roleId'] = options['roleId'];
		}
		if (utilsCheckExists(options['accessId'])) {
			if (!utilsCheckStrId(options['accessId'])) {
				throw new MethodNotAllowedException(`Property "accessId" is not valid.`);
			}
			output['accessId'] = options['accessId'];
		}
		if (utilsCheckExists(options['userId'])) {
			if (!utilsCheckStrId(options['userId'])) {
				throw new MethodNotAllowedException(`Property "userId" is not valid.`);
			}
			output['userId'] = options['userId'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
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
