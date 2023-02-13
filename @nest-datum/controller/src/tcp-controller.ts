import { Controller as NestjsController } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { Controller } from './controller';

@NestjsController()
export class TcpController extends Controller {
	protected exceptionConstructor = WarningException;
	protected transportService;
	protected entityService;

	async many(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.many(await this.validateMany(payload)));
	}

	async one(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.one(await this.validateOne(payload)));
	}

	async drop(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.drop(await this.validateDrop(payload)));
	}

	async dropMany(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.dropMany(await this.validateDropMany(payload)));
	}

	async create(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.create(await this.validateCreate(payload)));
	}

	async update(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.update(await this.validateUpdate(payload)));
	}
}
