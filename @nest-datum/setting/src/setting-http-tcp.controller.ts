import { 
	Post,
	Patch,
	Body,
	Param,
	MethodNotAllowedException,
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpTcpController } from '@nest-datum-common/controllers';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	strEnvKey as utilsCheckStrEnvKey,
	strRegex as utilsCheckStrRegex,
	strType as utilsCheckStrType,
	strDescription as utilsCheckStrDescription,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';

export class SettingHttpTcpController extends HttpTcpController {
	protected readonly transport;
	protected readonly serviceName: string;
	protected readonly entityName: string = 'setting';

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckStrFilled(options['envKey'])) {
			if (!utilsCheckStrEnvKey(options['envKey'])) {
				throw new MethodNotAllowedException(`Property "envKey" is not valid.`);
			}
			output['envKey'] = options['envKey'];
		}
		if (utilsCheckExists(options['name'])) {
			if (!utilsCheckStrName(options['name'])) {
				throw new MethodNotAllowedException(`Property "name" is not valid.`);
			}
			output['name'] = options['name'];
		}
		if (utilsCheckExists(options['description'])) {
			if (!utilsCheckStrDescription(options['description'])) {
				throw new MethodNotAllowedException(`Property "description" is not valid.`);
			}
			output['description'] = options['description'];
		}
		if (utilsCheckExists(options['dataTypeId'])) {
			if (!utilsCheckStrType(options['dataTypeId'])) {
				throw new MethodNotAllowedException(`Property "dataTypeId" is not valid.`);
			}
			output['dataTypeId'] = options['dataTypeId'];
		}
		if (utilsCheckStrFilled(options['regex'])) {
			if (!utilsCheckStrRegex(options['regex'])) {
				throw new MethodNotAllowedException(`Property "regex" is not valid.`);
			}
			output['regex'] = options['regex'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
			value: String(options['value'] ?? ''),
		};
	}

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('userId') userId: string,
		@Body('envKey') envKey: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('dataTypeId') dataTypeId: string,
		@Body('regex') regex: string,
		@Body('value') value: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(
			async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.create`,
		}, await this.validateCreate({
			accessToken,
			id,
			userId,
			envKey,
			name,
			description,
			dataTypeId,
			regex,
			value,
			isNotDelete,
		})));
	}

	@Patch(':id')
	async update(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body('id') newId: string,
		@Body('userId') userId: string,
		@Body('envKey') envKey: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('dataTypeId') dataTypeId: string,
		@Body('regex') regex: string,
		@Body('value') value: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(
			async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.update`,
		}, await this.validateUpdate({
			accessToken,
			id,
			newId,
			userId,
			envKey,
			name,
			description,
			dataTypeId,
			regex,
			value,
			isNotDelete,
			isDeleted,
		})));
	}
}
