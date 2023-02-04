import { 
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
	HttpException,
} from '@nestjs/common';
import {
	func as utilsCheckFunc, 
	obj as utilsCheckObj, 
	strName as utilsCheckStrName,
} from '@nest-datum-utils/check';
import { AccessToken } from '@nest-datum-common/decorators';

export class HttpController {
	public transportService;
	public serviceName = process.env.SERVICE_HTTP;
	public entityName = 'setting';

	async log(err) {
		if (!utilsCheckObj(err)
			|| !utilsCheckStrName(err['cmd'])
			|| !utilsCheckFunc(err['getCmd'])
			|| !utilsCheckFunc(err['options'])) {
			console.error(err);
			return;
		}
		this.transportService.sendLog(err);
	}

	@Get()
	async many(
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('query') query: string,
		@Query('filter') filter: string,
		@Query('sort') sort: string,
	): Promise<any> {
		try {
			return await this.transportService.send({
				name: this.serviceName, 
				cmd: `${this.entityName}.many`,
			}, {
				accessToken,
				select,
				relations,
				page,
				limit,
				query,
				filter,
				sort,
			});
		}
		catch (err) {
			this.log(err);

			throw new HttpException(err.message, err.errorCode || 500);
		}
	}

	@Get(':id')
	async one(
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Param('id') id: string,
	): Promise<any> {
		try {
			return await this.transportService.send({
				name: this.serviceName, 
				cmd: `${this.entityName}.one`,
			}, {
				accessToken,
				select,
				relations,
				id,
			});
		}
		catch (err) {
			this.log(err);

			throw new HttpException(err.message, err.errorCode || 500);
		}
	}

	@Delete(':id')
	async drop(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
	) {
		try {
			return await this.transportService.send({
				name: this.serviceName, 
				cmd: `${this.entityName}.drop`,
			}, {
				accessToken,
				id,
			});
		}
		catch (err) {
			this.log(err);

			throw new HttpException(err.message, err.errorCode || 500);
		}
	}

	@Delete(':id')
	async dropMany(
		@AccessToken() accessToken: string,
		@Param('ids') ids: string,
	) {
		try {
			return await this.transportService.send({
				name: this.serviceName, 
				cmd: `${this.entityName}.dropMany`,
			}, {
				accessToken,
				ids,
			});
		}
		catch (err) {
			this.log(err);

			throw new HttpException(err.message, err.errorCode || 500);
		}
	}
}
