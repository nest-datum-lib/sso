import { 
	Controller,
	Post,
	Patch,
	Body,
	Param,
	ForbiddenException,
	UnauthorizedException,
	MethodNotAllowedException,
} from '@nestjs/common';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpController } from '@nest-datum-common/controllers';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName, 
	strDescription as utilsCheckStrDescription,
	strFilled as utilsCheckStrFilled,
	strEmail as utilsCheckStrEmail,
	strPassword as utilsCheckStrPassword,
	str as utilsCheckStr,
	arr as utilsCheckArr,
	objFilled as utilsCheckObjFilled,
} from '@nest-datum-utils/check';
import { UserUserOptionService } from '../user-user-option/user-user-option.service';
import { UserService } from './user.service';

@Controller(`${process.env.SERVICE_SSO}/user`)
export class UserHttpController extends HttpController {
	protected readonly mainRelationColumnName: string = 'userId';
	protected readonly optionRelationColumnName: string = 'userOptionId';

	constructor(
		protected service: UserService,
		protected readonly serviceOptionContent: UserUserOptionService,
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
		if (utilsCheckExists(options['position'])) {
			if (!utilsCheckStrFilled(options['position'])) {
				throw new MethodNotAllowedException(`Property "position" is not valid.`);
			}
		}
		if (utilsCheckExists(options['location'])) {
			if (!utilsCheckStrFilled(options['location'])) {
				throw new MethodNotAllowedException(`Property "location" is not valid.`);
			}
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

	async validateOptions(options): Promise<any> {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`)
		}
		const user = getUser(options['accessToken']);
		const output = {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
		};

		try {
			output['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (utilsCheckObjFilled(options['data']) 
			&& utilsCheckStrId(options['data'][this.optionRelationColumnName ?? 'entityOptionId'])) {
			output[this.optionRelationColumnName ?? 'entityOptionId'] = options['data'][this.optionRelationColumnName ?? 'entityOptionId'];
			output['content'] = String(options['data'] ?? '');
		}
		else if (!utilsCheckArr(options['data'])) {
			throw new MethodNotAllowedException(`Property "data" is nt valid.`);
		}
		return output;
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
			position: options['position'],
			location: options['location'],
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
		const user = getUser(options['accessToken']);

		return { ...options, id: user['id'] };
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
		@Body('location') location: string,
		@Body('position') position: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.register(await this.validateRegister({
			email,
			login,
			firstname,
			lastname,
			password,
			repeatedPassword,
			location,
			position
		})));
	}

	@Post('verify')
	async verify(@Body('verifyKey') verifyKey: string): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.verify(await this.validateVerifyKey({ verifyKey })));
	}

	@Post('login')
	async login(
		@Body('login') login: string,
		@Body('password') password: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.login(await this.validateLogin({
			login,
			password,
		})));
	}

	@Post('recovery')
	async recovery(@Body('email') email: string): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.recovery(await this.validateRecovery({ email })));
	}

	@Post('reset')
	async reset(
		@Body('password') password: string,
		@Body('repeatedPassword') repeatedPassword: string,
		@Body('verifyKey') verifyKey: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.reset(await this.validateReset({
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
		return await this.serviceHandlerWrapper(async () => await this.service.refresh(await this.validateToken({
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
		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate({
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
		return await this.serviceHandlerWrapper(async () => await this.service.update(await this.validateUpdate({
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
}
