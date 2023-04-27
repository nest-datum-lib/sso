import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { OptionTcpController } from '@nest-datum/option';
import { UserOptionService } from './user-option.service';

@Controller()
export class UserOptionTcpController extends OptionTcpController {
	constructor(
		protected service: UserOptionService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'userOption.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'userOption.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('userOption.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('userOption.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('userOption.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('userOption.update')
	async update(payload) {
		return await super.update(payload);
	}

	@EventPattern('user.content')
	async content(payload) {
		return await super.content(payload);
	}

	@EventPattern('user.updateContent')
	async updateContent(payload) {
		return await super.updateContent(payload);
	}
}