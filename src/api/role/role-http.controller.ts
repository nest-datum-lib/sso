import { 
	Controller,
	Post,
	Patch,
	Body,
	Param,
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
	strFilled as utilsCheckStrFilled,
	strEnvKey as utilsCheckStrEnvKey,
} from '@nest-datum-utils/check';
import { RoleRoleOptionService } from '../role-role-option/role-role-option.service';
import { RoleRoleRoleOptionService } from '../role-role-role-option/role-role-role-option.service';
import { RoleService } from './role.service';

@Controller(`${process.env.SERVICE_SSO}/role`)
export class RoleHttpController extends MainHttpController {
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';

	constructor(
		protected service: RoleService,
		protected readonly serviceOptionContent: RoleRoleRoleOptionService,
		protected readonly serviceOptionRelation: RoleRoleOptionService,
	) {
		super();
	}

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleStatusId'])) {
			throw new MethodNotAllowedException(`Property "roleStatusId" is not valid.`);
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
		if (utilsCheckExists(options['roleStatusId'])) {
			if (!utilsCheckStrId(options['roleStatusId'])) {
				throw new MethodNotAllowedException(`Property "roleStatusId" is not valid.`);
			}
			output['roleStatusId'] = options['roleStatusId'];
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

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('envKey') envKey: string,
		@Body('userId') userId: string,
		@Body('roleStatusId') roleStatusId: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate({
			accessToken,
			id,
			envKey,
			userId,
			roleStatusId,
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
		@Body('envKey') envKey: string,
		@Body('userId') userId: string,
		@Body('roleStatusId') roleStatusId: string,
		@Body('name') name: string,
		@Body('description') description: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.update(await this.validateUpdate({
			accessToken,
			id,
			newId,
			envKey,
			userId,
			roleStatusId,
			name,
			description,
			isNotDelete,
			isDeleted,
		})));
	}
}
