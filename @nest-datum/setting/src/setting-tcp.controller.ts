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
	strEnvKey as utilsCheckStrEnvKey,
	strRegex as utilsCheckStrRegex,
	strType as utilsCheckStrType,
	strDescription as utilsCheckStrDescription,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';

export class SettingTcpController extends TcpController {
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckStrFilled(options['envKey'])) {
			if (!utilsCheckStrEnvKey(options['envKey'])) {
				throw new MethodNotAllowedException(`Property "envKey" is not valid.`);
			}
			output['envKey'] = options['envKey'];
		}
		if (utilsCheckExists(options['userId'])) {
			if (!utilsCheckStrId(options['userId'])) {
				throw new MethodNotAllowedException(`Property "userId" is not valid.`);
			}
			output['userId'] = options['userId'];
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
		if (utilsCheckExists(options['dataTypeId'])) {
			if (!utilsCheckStrType(options['dataTypeId'])) {
				throw new MethodNotAllowedException(`Property "dataTypeId" is not valid.`);
			}
			output['dataTypeId'] = options['dataTypeId'];
		}
		if (utilsCheckStrFilled(options['regex'])) {
			if (!utilsCheckStrRegex(options['regex'])) {
				throw new MethodNotAllowedException(`Property "regex" is not valid.`);
			}
			output['regex'] = options['regex'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
			value: String(options['value'] ?? ''),
		};
	}

	@MessagePattern({ cmd: 'setting.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'setting.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('setting.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('setting.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('setting.create')
	async create(payload: object = {}) {
		return await super.create(payload);
	}

	@EventPattern('setting.update')
	async update(payload: object = {}) {
		return await super.update(payload);
	}
}
