import { 
	Post,
	Patch,
	Body,
	Param, 
	MethodNotAllowedException, 
} from '@nestjs/common';
import { 
	exists as utilsCheckExists,
	str as utilsCheckStr,
	strId as utilsCheckStrId,
	strEnvKey as utilsCheckStrEnvKey,
	strName as utilsCheckStrName,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strType as utilsCheckStrType,
	bool as utilsCheckBool,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';
import { AccessToken } from '@nest-datum-common/decorators';
import { ManyHttpController } from '@nest-datum/many';

export class OptionHttpController extends ManyHttpController {
	protected readonly service;

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrType(options['dataTypeId'])) {
			throw new MethodNotAllowedException(`Property "dataTypeId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckExists(options['userId'])) {
			if (!utilsCheckStrId(options['userId'])) {
				throw new MethodNotAllowedException(`Property "userId" is not valid.`);
			}
			output['userId'] = options['userId'];
		}
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
		if (utilsCheckExists(options['isRequired'])) {
			if (!utilsCheckBool(options['isRequired'])) {
				throw new MethodNotAllowedException(`Property "isRequired" is not valid.`);
			}
			output['isRequired'] = options['isRequired'];
		}
		if (utilsCheckExists(options['isMultiline'])) {
			if (!utilsCheckBool(options['isMultiline'])) {
				throw new MethodNotAllowedException(`Property "isMultiline" is not valid.`);
			}
			output['isMultiline'] = options['isMultiline'];
		}
		if (utilsCheckExists(options['defaultValue'])) {
			if (!utilsCheckStr(options['defaultValue'])) {
				throw new MethodNotAllowedException(`Property "defaultValue" is not valid.`);
			}
			output['defaultValue'] = options['defaultValue'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
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
		@Body('defaultValue') defaultValue: string,
		@Body('isRequired') isRequired: boolean,
		@Body('isMultiline') isMultiline: boolean,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate({
			accessToken,
			id,
			userId,
			envKey,
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
		@Body('envKey') envKey: string,
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
		return await this.serviceHandlerWrapper(async () => await this.service.update(await this.validateUpdate({
			accessToken,
			id,
			newId,
			userId,
			envKey,
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
