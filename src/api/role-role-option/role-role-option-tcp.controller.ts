import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { BindTcpController } from '@nest-datum/bind';
import { RoleRoleOptionService } from './role-role-option.service';

@Controller()
export class RoleRoleOptionTcpController extends BindTcpController {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';

	constructor(
		protected service: RoleRoleOptionService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'roleOptionRelation.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'roleOptionRelation.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('roleOptionRelation.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('roleOptionRelation.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('roleOptionRelation.create')
	async create(payload) {
		return await super.create(payload);
	}
}
