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
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new ForbiddenException(`User is undefined or token is not valid.`);
		}
		if (options['login'] && !utilsCheckStrFilled(options['login'])) {
			throw new ForbiddenException(`Property "login" is not valid.`);
		}
		if (options['email'] && !utilsCheckStrEmail(options['email'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}
		if (options['password'] && !utilsCheckStrPassword(options['password'])) {
			throw new ForbiddenException(`Property "email" is not valid.`);
		}
		if (options['roleId'] && !utilsCheckStrId(options['roleId'])) {
			throw new ForbiddenException(`Property "roleId" is not valid.`);
		}
		if (options['userStatusId'] && !utilsCheckStrId(options['userStatusId'])) {
			throw new ForbiddenException(`Property "userStatusId" is not valid.`);
		}
		return {
			...await super.validateUpdate(options),
			...(options['userStatusId'] && utilsCheckStrId(options['userStatusId'])) 
				? { userStatusId: options['userStatusId'] } 
				: {},
			...(options['roleId'] && utilsCheckStrId(options['roleId'])) 
				? { roleId: options['roleId'] } 
				: {},
			...(options['email'] && utilsCheckStrEmail(options['email'])) 
				? { email: options['email'] } 
				: {},
			...(options['password'] && utilsCheckStrPassword(options['password'])) 
				? { password: options['password'] } 
				: {},
			...utilsCheckStr(options['emailVerifyKey']) 
				? { emailVerifyKey: options['emailVerifyKey'] } 
				: { emailVerifyKey: '' },
			...(options['login'] && utilsCheckStrFilled(options['login'])) 
				? { login: options['login'] } 
				: {},
		};
	}

	async validateOptions(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`)
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}
		try {
			options['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (!utilsCheckArr(options['data'])) {
			throw new MethodNotAllowedException(`Property "data" is nt valid.`);
		}
		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
			data: options['data'],
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

	async validateUpdateContent(options) : Promise<any> {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}

		return {
			id: options['id'],
			content: String(options['content'] ?? ''),
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
		return await this.serviceHandlerWrapper(async () => await this.service.register(await this.validateRegister({
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

	@Patch(':id/option')
	async updateContent(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body('content') content: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.serviceOptionContent.update(await this.validateUpdateContent({
			accessToken,
			id,
			content,
		})));
	}
}
