import { 
	Controller,
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
	MethodNotAllowedException,
	UnauthorizedException,
} from '@nestjs/common';
import { HttpController } from '@nest-datum-common/controllers';
import { AccessToken } from '@nest-datum-common/decorators';
import { 
	strId as utilsCheckStrId,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';

export class MainHttpController extends HttpController {
	protected readonly serviceOptionRelation;
	protected readonly serviceOptionContent;
	protected readonly mainRelationColumnName: string;
	protected readonly optionRelationColumnName: string;

	async validateOption(options): Promise<any> {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`)
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options[this.optionRelationColumnName] ?? options['entityOptionId'])) {
			throw new MethodNotAllowedException(`Property "${this.optionRelationColumnName}" is nt valid.`);
		}
		if (!utilsCheckStrId(options[this.mainRelationColumnName] ?? options['entityId'])) {
			throw new MethodNotAllowedException(`Property "${this.mainRelationColumnName}" is nt valid.`);
		}
		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			[this.mainRelationColumnName ?? 'entityId']: options[this.mainRelationColumnName] ?? options['entityId'],
			[this.optionRelationColumnName ?? 'entityOptionId']: options[this.optionRelationColumnName] ?? options['entityOptionId'],
		};
	}

	async validateOptions(options): Promise<any> {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`)
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}
		try {
			options['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (!utilsCheckArr(options['data'])) {
			throw new MethodNotAllowedException(`Property "data" is nt valid.`);
		}
		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	async validateUpdateContent(options) : Promise<any> {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}

		return {
			id: options['id'],
			content: String(options['content'] ?? ''),
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
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionRelation.many(await this.validateMany({
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
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionRelation.one(await this.validateOne({
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
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionRelation.drop(await this.validateDrop({
			accessToken,
			id,
		})));
	}

	@Post(':id/option')
	async createOption(
		@AccessToken() accessToken: string,
		@Param('id') entityOptionId: string,
		@Body() data,
	) {
		const dataKeys = Object.keys(data);
		const entityId = data[dataKeys[0]];

		return await this.serviceHandlerWrapper(async () => await this.serviceOptionRelation.create(await this.validateOption({
			accessToken,
			entityId,
			entityOptionId,
		})));
	}

	@Post(':id/options')
	async createOptions(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body() data,
	) {
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionContent.content(await this.validateOptions({
			accessToken,
			id,
			data,
		})));
	}

	@Patch(':id/option')
	async updateContent(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body('content') content: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionContent.update(await this.validateUpdateContent({
			accessToken,
			id,
			content,
		})));
	}
}
