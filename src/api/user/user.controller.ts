import getCurrentLine from 'get-current-line';
import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { BalancerService } from 'nest-datum/balancer/src';
import * as Validators from 'nest-datum/validators/src';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly balancerService: BalancerService,
	) {
	}

	@MessagePattern({ cmd: 'user.register' })
	async register(payload) {
		try {
			const output = await this.userService.register({
				email: Validators.email('email', payload['email'], {
					isRequired: true,
				}),
				login: Validators.str('login', payload['login'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				firstname: Validators.str('firstname', payload['firstname'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				lastname: Validators.str('lastname', payload['lastname'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				password: Validators.password('password', payload['password'], {
					isRequired: true,
				}),
				repeatedPassword: Validators.repeatedPassword('repeatedPassword', payload['repeatedPassword'], {
					isRequired: true,
					value: payload['password'],
				}),
				roleId: 'admin',
				userStatusId: 'active',
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.verify' })
	async verify(payload) {
		try {
			const output = await this.userService.verify({
				...Validators.verifyKey('verifyKey', payload['verifyKey'], {
					isRequired: true,
					includeValue: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.login' })
	async login(payload) {
		try {
			const output = await this.userService.login({
				login: Validators.str('login', payload['login'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				password: Validators.password('password', payload['password'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.recovery' })
	async recovery(payload) {
		try {
			const output = await this.userService.recovery({
				email: Validators.str('email', payload['email'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.reset' })
	async reset(payload) {
		try {
			const output = await this.userService.recovery({
				password: Validators.password('password', payload['password'], {
					isRequired: true,
				}),
				repeatedPassword: Validators.repeatedPassword('repeatedPassword', payload['repeatedPassword'], {
					isRequired: true,
					value: payload['password'],
				}),
				...Validators.verifyKey('verifyKey', payload['verifyKey'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.refresh' })
	async refresh(payload) {
		try {
			Validators.token('accessToken', payload['accessToken'], {
				isRequired: true,
			});

			const output = await this.userService.refresh({
				...Validators.token('refreshToken', payload['refreshToken'], {
					secret: process['JWT_SECRET_REFRESH_KEY'],
					timeout: process.env.JWT_REFRESH_TIMEOUT,
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.many' })
	async many(payload) {
		try {
			const many = await this.userService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_MANY'] ],
					isRequired: true,
				}),
				select: Validators.obj('select', payload['select']),
				relations: Validators.obj('select', payload['relations']),
				sort: Validators.obj('sort', payload['sort']),
				filter: Validators.obj('filter', payload['filter']),
				query: Validators.str('query', payload['query'], {
					min: 1,
					max: 255,
				}),
				page: Validators.int('page', payload['page'], {
					min: 1,
					default: 1,
				}),
				limit: Validators.int('limit', payload['limit'], {
					min: 1,
					default: 20,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.one' })
	async one(payload) {
		try {
			const output = await this.userService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_ONE'] ],
					isRequired: true,
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('user.drop')
	async drop(payload) {
		try {
			await this.userService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_DROP'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('user.dropMany')
	async dropMany(payload) {
		try {
			await this.userService.dropMany({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_DROP_MANY'] ],
					isRequired: true,
				}),
				ids: Validators.arr('ids', payload['ids'], {
					isRequired: true,
					min: 1,
				}),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('user.create')
	async create(payload) {
		try {
			const output = await this.userService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_CREATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				userStatusId: Validators.id('userStatusId', payload['userStatusId'], {
					isRequired: true,
				}),
				roleId: Validators.id('roleId', payload['roleId'], {
					isRequired: true,
				}),
				email: Validators.email('email', payload['email'], {
					isRequired: true,
				}),
				password: Validators.password('password', payload['password'], {
					isRequired: true,
				}),
				emailVerifyKey: Validators.str('emailVerifyKey', payload['emailVerifyKey'], {
					min: 1,
					max: 255,
				}) || '',
				emailVerifiedAt: Validators.date('emailVerifiedAt', payload['emailVerifiedAt']),
				login: Validators.str('login', payload['login'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				isNotDelete: Validators.bool('isNotDelete', payload['isNotDelete']),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('user.createOptions')
	async createOptions(payload) {
		try {
			const output = await this.userService.createOptions({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_CREATE_OPTIONS'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				data: Validators.arr('data', payload['data'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('user.update')
	async update(payload) {
		try {
			await this.userService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_SSO_USER_UPDATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
				newId: Validators.id('newId', payload['newId']),
				userStatusId: Validators.id('userStatusId', payload['userStatusId']),
				roleId: Validators.id('roleId', payload['roleId']),
				email: Validators.email('email', payload['email']),
				password: Validators.password('password', payload['password']),
				emailVerifyKey: Validators.str('emailVerifyKey', payload['emailVerifyKey'], {
					min: 1,
					max: 255,
				}),
				emailVerifiedAt: Validators.date('emailVerifiedAt', payload['emailVerifiedAt']),
				login: Validators.str('login', payload['login'], {
					min: 1,
					max: 255,
				}),
				isNotDelete: Validators.bool('isNotDelete', payload['isNotDelete']),
				isDeleted: Validators.bool('isDeleted', payload['isDeleted']),
				createdAt: Validators.date('createdAt', payload['createdAt']),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}
}
