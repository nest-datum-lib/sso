import { 
	Controller,
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
	ForbiddenException,
} from '@nestjs/common';
import { HttpTcpOptionController } from '@nest-datum/controller';
import { AccessToken } from '@nest-datum-common/decorators';
import { checkToken } from '@nest-datum/jwt';
import {
	strName as utilsCheckStrName,
	strId as utilsCheckStrId,
} from '@nest-datum-utils/check';

export class AccessHttpTcpController extends HttpTcpOptionController {
	protected transportService;
	protected serviceName;
	protected entityName = 'access';
	protected entityOptionContentName = 'accessOptionRelation';
	protected entityRoleAccessName = 'roleAccess';

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new ForbiddenException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['accessStatusId'])) {
			throw new ForbiddenException(`Property "accessStatusId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			...(options['accessStatusId'] && utilsCheckStrId(options['accessStatusId'])) 
				? { accessStatusId: options['accessStatusId'] } 
				: {},
		};
	}

	async validateRoleAccess(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		if (!utilsCheckStrId(options['accessId'])) {
			throw new ForbiddenException(`Property "accessId" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleId'])) {
			throw new ForbiddenException(`Property "roleId" is not valid.`);
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
		@Body('name') name: string,
		@Body('envKey') envKey: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.create`,
		}, await this.validateCreate({
			accessToken,
			id,
			userId,
			accessStatusId,
			name,
			envKey,
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
		@Body('name') name: string,
		@Body('envKey') envKey: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.update`,
		}, await this.validateUpdate({
			accessToken,
			id,
			newId,
			userId,
			accessStatusId,
			name,
			envKey,
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
		return await this.serviceHandlerWrapper(async () => await this.transportService.send({
			name: this.serviceName, 
			cmd: `${this.entityRoleAccessName}.create`,
		}, await this.validateRoleAccess({
			accessToken,
			accessId,
			roleId,
		})));
	}
}
