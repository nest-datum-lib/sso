import { 
	Post,
	Patch,
	Body,
	Param,
	UnauthorizedException,
	MethodNotAllowedException,
} from '@nestjs/common';
import { checkToken } from '@nest-datum-common/jwt';
import { AccessToken } from '@nest-datum-common/decorators';
import { MainHttpController } from '@nest-datum/main';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName, 
	strDescription as utilsCheckStrDescription,
	strEnvKey as utilsCheckStrEnvKey,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';

export class AccessHttpController extends MainHttpController {
	protected readonly serviceOption;
	protected readonly serviceRoleAccess;
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessStatusId'])) {
			throw new MethodNotAllowedException(`Property "accessStatusId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckExists(options['accessStatusId'])) {
			if (!utilsCheckStrId(options['accessStatusId'])) {
				throw new MethodNotAllowedException(`Property "accessStatusId" is not valid.`);
			}
			output['accessStatusId'] = options['accessStatusId'];
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
		return {
			...await super.validateUpdate(options),
			...output,
		};
	}

	async validateRoleAccess(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		if (!utilsCheckStrId(options['accessId'])) {
			throw new MethodNotAllowedException(`Property "accessId" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleId'])) {
			throw new MethodNotAllowedException(`Property "roleId" is not valid.`);
		}
		return {
			accessToken: options['accessToken'],
			accessId: options['accessId'],
			roleId: options['roleId'],
		};
	}

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('userId') userId: string,
		@Body('accessStatusId') accessStatusId: string,
		@Body('envKey') envKey: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate({
			accessToken,
			id,
			userId,
			accessStatusId,
			envKey,
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
		@Body('accessStatusId') accessStatusId: string,
		@Body('envKey') envKey: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.update(await this.validateUpdate({
			accessToken,
			id,
			newId,
			userId,
			accessStatusId,
			envKey,
			name,
			description,
			isNotDelete,
			isDeleted,
		})));
	}

	@Post(':id/role')
	async createRoleAccess(
		@AccessToken() accessToken: string,
		@Param('id') accessId: string,
		@Body('roleId') roleId: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.serviceRoleAccess.create(await this.validateRoleAccess({
			accessToken,
			accessId,
			roleId,
		})));
	}
}
