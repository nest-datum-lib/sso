import { 
	Post,
	Patch,
	Body,
	Param,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpTcpController } from '../../controller/src';
import { strName as utilsCheckStrName } from '@nest-datum-utils/check';

@Controller()
export class StatusHttpTcpController extends HttpTcpController {
	protected transportService;
	protected serviceName;
	protected entityName;
	
	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new this.exceptionConstructor(`Property "name" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('userId') userId: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(
			async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.create`,
		}, await this.validateCreate({
			accessToken,
			id,
			userId,
			name,
			description,
			isNotDelete,
		})));
	}
	@Patch(':id')
	async update(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body('id') newId: string,
		@Body('userId') userId: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(
			async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.update`,
		}, await this.validateUpdate({
			accessToken,
			id,
			newId,
			userId,
			name,
			description,
			isNotDelete,
			isDeleted,
		})));
	}
}
