import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '@nest-datum/transport';
import { Controller as NestDatumController } from '@nest-datum-common/controller';
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
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import { UserService } from './user.service';

@Controller()
export class UserController extends NestDatumController {
	constructor(
		public transportService: TransportService,
		public service: UserService,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}): object {
		if (!utilsCheckStrName(options['login'])) {
			throw new WarningException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrEmail(options['email'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrId(options['roleId'])) {
			throw new WarningException(`Property "roleId" is not valid.`);
		}
		if (!utilsCheckStrId(options['userStatusId'])) {
			throw new WarningException(`Property "userStatusId" is not valid.`);
		}
		return this.validateUpdate(options);
	}

	validateUpdate(options: object = {}): object {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		if (options['login'] && !utilsCheckStrName(options['login'])) {
			throw new WarningException(`Property "login" is not valid.`);
		}
		if (options['email'] && !utilsCheckStrEmail(options['email'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}
		if (options['password'] && !utilsCheckStrPassword(options['password'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}
		if (options['roleId'] && !utilsCheckStrId(options['roleId'])) {
			throw new WarningException(`Property "roleId" is not valid.`);
		}
		if (options['userStatusId'] && !utilsCheckStrId(options['userStatusId'])) {
			throw new WarningException(`Property "userStatusId" is not valid.`);
		}

		return {
			id: (options['id'] && !utilsCheckStrId(options['id'])) 
				? { id: options['id'] } 
				: {},
			newId: (options['newId'] && !utilsCheckStrId(options['newId'])) 
				? { newId: options['newId'] } 
				: {},
			userStatusId: (options['userStatusId'] && !utilsCheckStrId(options['userStatusId'])) 
				? { userStatusId: options['userStatusId'] } 
				: {},
			roleId: (options['roleId'] && !utilsCheckStrId(options['roleId'])) 
				? { roleId: options['roleId'] } 
				: {},
			email: (options['email'] && !utilsCheckStrEmail(options['email'])) 
				? { email: options['email'] } 
				: {},
			password: (options['password'] && !utilsCheckStrPassword(options['password'])) 
				? { password: options['password'] } 
				: {},
			emailVerifyKey: (options['emailVerifyKey'] && !utilsCheckStr(options['emailVerifyKey'])) 
				? { emailVerifyKey: options['emailVerifyKey'] } 
				: {},
			emailVerifiedAt: (options['emailVerifiedAt'] && !utilsCheckStrDate(options['emailVerifiedAt'])) 
				? { emailVerifiedAt: options['emailVerifiedAt'] } 
				: {},
			login: (options['login'] && !utilsCheckStrName(options['login'])) 
				? { login: options['login'] } 
				: {},
			isNotDelete: (utilsCheckExists(options['isNotDelete']) && !utilsCheckBool(options['isNotDelete'])) ? { isNotDelete: options['isNotDelete'] } : {},
			isDeleted: (utilsCheckExists(options['isDeleted']) && !utilsCheckBool(options['isDeleted'])) ? { isDeleted: options['isDeleted'] } : {},
		};
	}

	validateLogin(options: object = {}) {
		if (!utilsCheckStrName(options['login'])) {
			throw new WarningException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password'])) {
			throw new WarningException(`Property "password" is not valid.`);
		}
		return {
			login: options['login'],
			password: options['password'],
		};
	}

	validateRegister(options: object = {}) {
		if (!utilsCheckStrName(options['login'])) {
			throw new WarningException(`Property "login" is not valid.`);
		}
		if (!utilsCheckStrName(options['firstname'])) {
			throw new WarningException(`Property "firstname" is not valid.`);
		}
		if (!utilsCheckStrName(options['lastname'])) {
			throw new WarningException(`Property "lastname" is not valid.`);
		}
		if (!utilsCheckStrEmail(options['email'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}
		if (!utilsCheckStrPassword(options['password']) || options['password'] !== options['repeatedPassword']) {
			throw new WarningException(`Property "password" is not valid.`);
		}

		return {
			login: options['login'],
			firstname: options['firstname'],
			lastname: options['lastname'],
			email: options['email'],
			password: options['password'],
			repeatedPassword: options['repeatedPassword'],
			roleId: 'sso-role-member',
			userStatusId: 'sso-user-status-new',
		};
	}

	validateRecovery(options: object = {}) {
		if (!utilsCheckStrEmail(options['email'])) {
			throw new WarningException(`Property "email" is not valid.`);
		}

		return {
			email: options['email'],
		};
	}

	validateReset(options: object = {}) {
		if (!utilsCheckStrPassword(options['password']) || options['password'] !== options['repeatedPassword']) {
			throw new WarningException(`Property "password" is not valid.`);
		}

		return {
			password: options['password'],
			repeatedPassword: options['repeatedPassword'],
			...this.validateVerifyKey(options),
		};
	}

	validateToken(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid [1].`);
		}
		if (!checkToken(options['refreshToken'], process.env.JWT_SECRET_REFRESH_KEY)) {
			throw new WarningException(`User is undefined or token is not valid [2].`);
		}
		return getUser(options['refreshToken']);
	}

	async validateVerifyKey(options: object = {}) {
		try {
			return {
				verifyKey: (JSON.parse(Buffer.from(options['verifyKey'], 'base64').toString()))['verifyKey'],
			};
		}
		catch (err) {
			throw new WarningException(`Property "verifyKey" is not valid.`);
		}
	}

	@MessagePattern({ cmd: 'user.register' })
	async register(payload) {
		try {
			const output = await this.service.register(this.validateRegister(payload));

			this.transportService.decrementLoadingIndicator();

			return output
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.verify' })
	async verify(payload) {
		try {
			const output = await this.service.verify(this.validateVerifyKey(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.login' })
	async login(payload) {
		try {
			const output = await this.service.login(this.validateLogin(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.recovery' })
	async recovery(payload) {
		try {
			const output = await this.service.recovery(this.validateRecovery(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.reset' })
	async reset(payload) {
		try {
			const output = await this.service.reset(this.validateReset(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.refresh' })
	async refresh(payload) {
		try {
			const output = await this.service.refresh(this.validateToken(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}
}
