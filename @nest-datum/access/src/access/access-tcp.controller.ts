import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName, 
	strDescription as utilsCheckStrDescription,
	strEnvKey as utilsCheckStrEnvKey,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';

export class AccessTcpController extends TcpController {
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessStatusId'])) {
			throw new MethodNotAllowedException(`Property "accessStatusId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckExists(options['accessStatusId'])) {
			if (!utilsCheckStrId(options['accessStatusId'])) {
				throw new MethodNotAllowedException(`Property "accessStatusId" is not valid.`);
			}
			output['accessStatusId'] = options['accessStatusId'];
		}
		if (utilsCheckExists(options['userId'])) {
			if (!utilsCheckStrId(options['userId'])) {
				throw new MethodNotAllowedException(`Property "userId" is not valid.`);
			}
			output['userId'] = options['userId'];
		}
		if (utilsCheckStrFilled(options['envKey'])) {
			if (!utilsCheckStrEnvKey(options['envKey'])) {
				throw new MethodNotAllowedException(`Property "envKey" is not valid.`);
			}
			output['envKey'] = options['envKey'];
		}
		if (utilsCheckExists(options['name'])) {
			if (!utilsCheckStrName(options['name'])) {
				throw new MethodNotAllowedException(`Property "name" is not valid.`);
			}
			output['name'] = options['name'];
		}
		if (utilsCheckExists(options['description'])) {
			if (!utilsCheckStrDescription(options['description'])) {
				throw new MethodNotAllowedException(`Property "description" is not valid.`);
			}
			output['description'] = options['description'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
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
