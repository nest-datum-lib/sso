import { 
	Controller,
	Post,
	Patch,
	Body,
	Param, 
} from '@nestjs/common';
import { HttpTcpController } from '../../../controller/src';
import { AccessToken } from '../../../../@nest-datum-common/decorators/src';
import { 
	strName as utilsCheckStrName,
	strDataType as utilsCheckStrDataType,
} from '@nest-datum-utils/check';

@Controller()
export class OptionHttpTcpController extends HttpTcpController {
	protected transportService;
	protected serviceName;
	protected entityName;

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new this.exceptionConstructor(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrDataType(options['dataTypeId'])) {
			throw new this.exceptionConstructor(`Property "dataTypeId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			defaultValue: String(options['defaultValue'] ?? ''),
		};
	}

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('userId') userId: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('dataTypeId') dataTypeId: string,
		@Body('regex') regex: string,
		@Body('defaultValue') defaultValue: string,
		@Body('isRequired') isRequired: boolean,
		@Body('isMultiline') isMultiline: boolean,
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
			dataTypeId,
			regex,
			defaultValue,
			isRequired,
			isMultiline,
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
		@Body('dataTypeId') dataTypeId: string,
		@Body('regex') regex: string,
		@Body('defaultValue') defaultValue: string,
		@Body('isRequired') isRequired: boolean,
		@Body('isMultiline') isMultiline: boolean,
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
			dataTypeId,
			regex,
			defaultValue,
			isRequired,
			isMultiline,
			isNotDelete,
			isDeleted,
		})));
	}
}
