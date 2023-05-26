import { 
	Controller,
	Post,
	Patch,
	Body,
	Param,
	UnauthorizedException,
	ForbiddenException,
	MethodNotAllowedException,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { MainHttpTcpController } from '@nest-datum/main';
import { AccessToken } from '@nest-datum-common/decorators';
import { 
	bool as utilsCheckBool,
	exists as utilsCheckExists,
	str as utilsCheckStr,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	strEmail as utilsCheckStrEmail,
	strPassword as utilsCheckStrPassword,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strDate as utilsCheckStrDate,
	strFilled as utilsCheckStrFilled,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';

@Controller(`${process.env.SERVICE_SSO}/user`)
export class UserHttpTcpController extends MainHttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_SSO;
	protected readonly entityName: string = 'user';
	protected readonly entityManyName: string = 'userOptionRelation';
	protected readonly mainRelationColumnName: string = 'userId';
	protected readonly optionRelationColumnName: string = 'userOptionId';

	constructor(
		protected transport: TransportService,
	) {
		super();
	}

	async validateCreate(options) {
		if (!utilsCheckStrFilled(options['login'])) {
			throw new ForbiddenException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrEmail(options['email'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleId'])) {
			throw new ForbiddenException(`Property "roleId" is not valid.`);
		}
		if (!utilsCheckStrId(options['userStatusId'])) {
			throw new ForbiddenException(`Property "userStatusId" is not valid.`);
		}
		if (!utilsCheckStrFilled(options['position'])) {
			throw new ForbiddenException(`Property "position" is not valid.`);
		}
		if (!utilsCheckStrFilled(options['location'])) {
			throw new ForbiddenException(`Property "location" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		const output = {
			...utilsCheckStr(options['emailVerifyKey']) 
				? { emailVerifyKey: options['emailVerifyKey'] } 
				: { emailVerifyKey: '' },
		};

		if (utilsCheckExists(options['roleId'])) {
			if (!utilsCheckStrId(options['roleId'])) {
				throw new MethodNotAllowedException(`Property "roleId" is not valid.`);
			}
			output['roleId'] = options['roleId'];
		}
		if (utilsCheckExists(options['userStatusId'])) {
			if (!utilsCheckStrId(options['userStatusId'])) {
				throw new MethodNotAllowedException(`Property "userStatusId" is not valid.`);
			}
			output['userStatusId'] = options['userStatusId'];
		}
		if (utilsCheckExists(options['login'])) {
			if (!utilsCheckStrFilled(options['login'])) {
				throw new MethodNotAllowedException(`Property "login" is not valid.`);
			}
			output['login'] = options['login'];
		}
		if (utilsCheckExists(options['email'])) {
			if (!utilsCheckStrEmail(options['email'])) {
				throw new MethodNotAllowedException(`Property "email" is not valid.`);
			}
			output['email'] = options['email'];
		}
		if (utilsCheckExists(options['password'])) {
			if (!utilsCheckStrPassword(options['password'])) {
				throw new MethodNotAllowedException(`Property "password" is not valid.`);
			}
			output['password'] = options['password'];
		}
		if (utilsCheckExists(options['position'])) {
			if (!utilsCheckStrFilled(options['position'])) {
				throw new MethodNotAllowedException(`Property "position" is not valid.`);
			}
			output['position'] = options['position'];
		}
		if (utilsCheckExists(options['location'])) {
			if (!utilsCheckStrFilled(options['location'])) {
				throw new MethodNotAllowedException(`Property "location" is not valid.`);
			}
			output['location'] = options['location'];
		}
		return {
			...await super.validateUpdate(options),
			...output,
		};
	}

	async validateLogin(options) {
		if (!utilsCheckStrFilled(options['login'])) {
			throw new ForbiddenException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password'])) {
			throw new ForbiddenException(`Property "password" is not valid.`);
		}
		return {
			login: options['login'],
			password: options['password'],
		};
	}

	async validateRegister(options) {
		if (!utilsCheckStrFilled(options['login'])) {
			throw new ForbiddenException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrName(options['firstname'])) {
			throw new ForbiddenException(`Property "firstname" is not valid.`);
		}
		if (!utilsCheckStrName(options['lastname'])) {
			throw new ForbiddenException(`Property "lastname" is not valid.`);
		}
		if (!utilsCheckStrEmail(options['email'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password']) || options['password'] !== options['repeatedPassword']) {
			throw new ForbiddenException(`Property "password" is not valid.`);
		}

		return {
			login: options['login'],
			firstname: options['firstname'],
			lastname: options['lastname'],
			email: options['email'],
			password: options['password'],
			repeatedPassword: options['repeatedPassword'],
			roleId: 'happ-sso-role-member',
			userStatusId: 'happ-sso-user-status-new',
		};
	}

	async validateRecovery(options) {
		if (!utilsCheckStrEmail(options['email'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}

		return {
			email: options['email'],
		};
	}

	async validateReset(options) {
		if (!utilsCheckStrPassword(options['password']) || options['password'] !== options['repeatedPassword']) {
			throw new ForbiddenException(`Property "password" is not valid.`);
		}

		return {
			password: options['password'],
			repeatedPassword: options['repeatedPassword'],
			...await this.validateVerifyKey(options),
		};
	}

	async validateToken(options) {
		if (!utilsCheckStr(options['accessToken'])) {
			throw new ForbiddenException(`User is undefined or access token is not valid.`);
		}
		if (!utilsCheckStr(options['refreshToken'])) {
			throw new ForbiddenException(`User is undefined or refresh token is not valid.`);
		}
		return { ...options };
	}

	async validateVerifyKey(options) {
		if (!utilsCheckStr(options['verifyKey'])) {
			throw new ForbiddenException(`Property "verifyKey" is not valid.`);
		}
		return {
			verifyKey: options['verifyKey'],
		};
	}

	@Post('register')
	async register(
		@Body('email') email: string,
		@Body('login') login: string,
		@Body('firstname') firstname: string,
		@Body('lastname') lastname: string,
		@Body('password') password: string,
		@Body('repeatedPassword') repeatedPassword: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.register`,
		}, await this.validateRegister({
			email,
			login,
			firstname,
			lastname,
			password,
			repeatedPassword,
		})));
	}

	@Post('verify')
	async verify(@Body('verifyKey') verifyKey: string): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.verify`,
		}, await this.validateVerifyKey({ verifyKey })));
	}

	@Post('login')
	async login(
		@Body('login') login: string,
		@Body('password') password: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.login`,
		}, await this.validateLogin({
			login,
			password,
		})));
	}

	@Post('recovery')
	async recovery(@Body('email') email: string): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.recovery`,
		}, await this.validateRecovery({ email })));
	}

	@Post('reset')
	async reset(
		@Body('password') password: string,
		@Body('repeatedPassword') repeatedPassword: string,
		@Body('verifyKey') verifyKey: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.reset`,
		}, await this.validateReset({
			password,
			repeatedPassword,
			verifyKey,
		})));
	}

	@Post('refresh')
	async refresh(
		@Body('accessToken') accessToken: string,
		@Body('refreshToken') refreshToken: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.refresh`,
		}, await this.validateToken({
			accessToken,
			refreshToken,
		})));
	}

	@Post()
	async create(
		@AccessToken() accessToken: string,
		@Body('id') id: string,
		@Body('userId') userId: string,
		@Body('roleId') roleId: string,
		@Body('userStatusId') userStatusId: string,
		@Body('login') login: string,
		@Body('email') email: string,
		@Body('password') password: string,
		@Body('emailVerifyKey') emailVerifyKey: string,
		@Body('emailVerifiedAt') emailVerifiedAt: string,
		@Body('isNotDelete') isNotDelete: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.create`,
		}, await this.validateCreate({
			accessToken,
			id,
			userId,
			roleId,
			userStatusId,
			login,
			email,
			password,
			emailVerifyKey,
			emailVerifiedAt,
			isNotDelete,
		})));
	}

	@Patch(':id')
	async update(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body('id') newId: string,
		@Body('roleId') roleId: string,
		@Body('userStatusId') userStatusId: string,
		@Body('login') login: string,
		@Body('email') email: string,
		@Body('password') password: string,
		@Body('emailVerifyKey') emailVerifyKey: string,
		@Body('emailVerifiedAt') emailVerifiedAt: string,
		@Body('isNotDelete') isNotDelete: boolean,
		@Body('isDeleted') isDeleted: boolean,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.update`,
		}, await this.validateUpdate({
			accessToken,
			id,
			newId,
			roleId,
			userStatusId,
			login,
			email,
			password,
			emailVerifyKey,
			emailVerifiedAt,
			isNotDelete,
			isDeleted,
		})));
	}
}
