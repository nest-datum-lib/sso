import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionTcpController } from '@nest-datum/option';
import { RoleOptionService } from './role-option.service';

@Controller()
export class RoleOptionTcpController extends OptionTcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: RoleOptionService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'roleOption.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleOption.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleOption.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleOption.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleOption.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('roleOption.update')
	async update(payload) {
		return await super.update(payload);
	}

	@EventPattern('role.content')
	async content(payload) {
		return await super.content(payload);
	}
}
