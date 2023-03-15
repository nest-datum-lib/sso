import { 
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
	ForbiddenException,
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { Controller } from './controller';

export class HttpController extends Controller {
	protected exceptionConstructor = ForbiddenException;
	protected transportService;
	protected entityService;

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
		return await this.serviceHandlerWrapper(async () => await this.entityService.many(await this.validateMany({
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

	@Get(':id')
	async one(
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Param('id') id: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.entityService.one(await this.validateOne({
			accessToken,
			select,
			relations,
			id,
		})));
	}

	@Delete(':id')
	async drop(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.drop(await this.validateDrop({
			accessToken,
			id,
		})));
	}

	@Delete()
	async dropMany(
		@AccessToken() accessToken: string,
		@Query('ids') ids: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.dropMany(await this.validateDropMany({
			accessToken,
			ids,
		})));
	}
}
