import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TcpController as NestDatumTcpController } from '../../controller/src';
import { 
	strName as utilsCheckStrName,
	strDataType as utilsCheckStrDataType,
} from '@nest-datum-utils/check';

export class SettingTcpController extends NestDatumTcpController {
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new WarningException(`Property "name" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
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
