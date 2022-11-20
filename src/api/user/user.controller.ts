import getCurrentLine from 'get-current-line';
import * as Validators from '@nest-datum/validators';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { 
	RegistryService,
	LogsService, 
} from '@nest-datum/services';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
		private readonly userService: UserService,
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

			await this.registryService.clearResources();

			return output
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.refresh' })
	async refresh(payload) {
		try {
			Validators.token('accessToken', payload['accessToken'], {
				secret: process.env.JWT_SECRET_ACCESS_KEY,
				timeout: process.env.JWT_ACCESS_TIMEOUT,
				isRequired: true,
				role: {
					name: [ 'Admin' ],
				},
			});

			const output = await this.userService.refresh({
				...Validators.token('refreshToken', payload['refreshToken'], {
					secret: process.env.JWT_SECRET_REFRESH_KEY,
					timeout: process.env.JWT_REFRESH_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
			});

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.many' })
	async many(payload) {
		try {
			const many = await this.userService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
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

			await this.registryService.clearResources();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.one' })
	async one(payload) {
		try {
			const output = await this.userService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.drop' })
	async drop(payload) {
		try {
			await this.userService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.dropMany' })
	async dropMany(payload) {
		try {
			await this.userService.dropMany({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				ids: Validators.arr('ids', payload['ids'], {
					isRequired: true,
					min: 1,
				}),
			});
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.create' })
	async create(payload) {
		try {
			const output = await this.userService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.createOptions' })
	async createOptions(payload) {
		try {
			const output = await this.userService.createOptions({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id']),
				data: Validators.arr('data', payload['data'], {
					isRequired: true,
				}),
			});

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'user.update' })
	async update(payload) {
		try {
			await this.userService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
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
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}
}
