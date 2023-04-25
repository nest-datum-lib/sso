import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ForbiddenException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers';
import { TransportService } from '@nest-datum/transport';
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
import { UserService } from './user.service';

@Controller()
export class UserTcpController extends TcpController {
	constructor(
		protected service: UserService,
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
			...(options['newId'] && utilsCheckStrId(options['newId']))
				? { newId: options['newId'] }
				: {},
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
			...(utilsCheckExists(options['isNotDelete']) && utilsCheckBool(options['isNotDelete']))
				? { isNotDelete: options['isNotDelete'] }
				: {},
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
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new ForbiddenException(`User is undefined or token is not valid [1].`);
		}
		if (!checkToken(options['refreshToken'], process.env.JWT_SECRET_REFRESH_KEY)) {
			throw new ForbiddenException(`User is undefined or token is not valid [2].`);
		}
		return getUser(options['refreshToken']);
	}

	async validateVerifyKey(options) {
		if (!utilsCheckStr(options['verifyKey'])) {
			throw new ForbiddenException(`Property "verifyKey" is not valid.`);
		}
		return {
			verifyKey: options['verifyKey'],
		};
	}

	@MessagePattern({ cmd: 'user.register' })
	async register(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.register(await this.validateRegister(payload)));
	}

	@MessagePattern({ cmd: 'user.verify' })
	async verify(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.verify(await this.validateVerifyKey(payload)));
	}

	@MessagePattern({ cmd: 'user.login' })
	async login(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.login(await this.validateLogin(payload)));
	}

	@MessagePattern({ cmd: 'user.recovery' })
	async recovery(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.recovery(await this.validateRecovery(payload)));
	}

	@MessagePattern({ cmd: 'user.reset' })
	async reset(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.reset(await this.validateReset(payload)));
	}

	@MessagePattern({ cmd: 'user.refresh' })
	async refresh(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.refresh(await this.validateToken(payload)));
	}

	@MessagePattern({ cmd: 'user.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'user.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('user.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('user.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('user.create')
	async create(payload) {
		return await super.create(payload);
	}

	@EventPattern('user.update')
	async update(payload) {
		return await super.update(payload);
	}
}
