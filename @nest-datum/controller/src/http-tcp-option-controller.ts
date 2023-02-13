import { 
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import {
	strId as utilsCheckStrId,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { HttpTcpController } from './http-tcp-controller';

export class HttpTcpOptionController extends HttpTcpController {
	protected transportService;
	protected serviceName = process.env.SERVICE_HTTP;
	protected entityName = 'setting';
	protected entityOptionContentName;

	async validateOption(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['entityOptionId'])) {
			throw new this.exceptionConstructor(`Property "entityOptionId" is nt valid.`);
		}
		if (!utilsCheckStrId(options['entityId'])) {
			throw new this.exceptionConstructor(`Property "entityId" is nt valid.`);
		}

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			entityId: options['entityId'],
			entityOptionId: options['entityOptionId'],
		};
	}

	async validateOptions(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new this.exceptionConstructor(`Property "id" is nt valid.`);
		}
		try {
			options['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (!utilsCheckArr(options['data'])) {
			throw new this.exceptionConstructor(`Property "data" is nt valid.`);
		}

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	@Get('option')
	async optionMany(
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('query') query: string,
		@Query('filter') filter: string,
		@Query('sort') sort: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityOptionContentName}.many`,
		}, await this.validateMany({
			accessToken,
			select,
			relations,
			page,
			limit,
			query,
			filter,
			sort,
		})));
	}

	@Get('option/:id')
	async optionOne(
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Param('id') id: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityOptionContentName}.one`,
		}, await this.validateOne({
			accessToken,
			select,
			relations,
			id,
		})));
	}

	@Delete('option/:id')
	async optionDrop(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityOptionContentName}.drop`,
		}, await this.validateDrop({
			accessToken,
			id,
		})));
	}

	@Post(':id/option')
	async createOption(
		@AccessToken() accessToken: string,
		@Param('id') entityOptionId: string,
		@Body() body,
	) {
		const bodyKeys = Object.keys(body);
		const entityId = body[bodyKeys[0]];

		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityOptionContentName}.create`,
		}, await this.validateOption({
			accessToken,
			entityOptionId,
			entityId,
		})));
	}

	@Post(':id/options')
	async createOptions(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body() data,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.content`,
		}, await this.validateOptions({
			accessToken,
			id,
			data,
		})));
	}
}
