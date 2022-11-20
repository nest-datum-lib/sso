import { Promise as Bluebird } from 'bluebird';
import { Connection } from 'typeorm';
import {
	Injectable,
	Logger,
} from '@nestjs/common';
import { CacheService } from '@nest-datum/services';
import { AccessStatusSeeder } from './access-status.seeder';
import { AccessOptionSeeder } from './access-option.seeder';
import { AccessAccessOptionSeeder } from './access-access-option.seeder';
import { AccessSeeder } from './access.seeder';
import { RoleStatusSeeder } from './role-status.seeder';
import { RoleOptionSeeder } from './role-option.seeder';
import { RoleRoleOptionSeeder } from './role-role-option.seeder';
import { RoleSeeder } from './role.seeder';
import { UserStatusSeeder } from './user-status.seeder';
import { UserOptionSeeder } from './user-option.seeder';
import { UserUserOptionSeeder } from './user-user-option.seeder';
import { UserSeeder } from './user.seeder';
import { SettingSeeder } from './setting.seeder';

@Injectable()
export class SeedService {
	private readonly seeders = [];
	private readonly logger = new Logger(SeedService.name);

	constructor(
		private readonly cacheService: CacheService,
		private readonly connection: Connection,
		private readonly accessStatuses: AccessStatusSeeder,
		// private readonly accessOptions: AccessOptionSeeder,
		private readonly roleStatuses: RoleStatusSeeder,
		// private readonly roleOptions: RoleOptionSeeder,
		private readonly userStatuses: UserStatusSeeder,
		private readonly userOptions: UserOptionSeeder,
		// private readonly settings: SettingSeeder,
		private readonly access: AccessSeeder,
		// private readonly accessAccessOptions: AccessAccessOptionSeeder,
		private readonly role: RoleSeeder,
		// private readonly roleRoleOptions: RoleRoleOptionSeeder,
		private readonly user: UserSeeder,
		private readonly userUserOptions: UserUserOptionSeeder,
	) {
		this.seeders = [
			this.accessStatuses,
			// this.accessOptions,
			this.roleStatuses,
			// this.roleOptions,
			// this.settings,
			this.access,
			// this.accessAccessOptions,
			this.role,
			// this.roleRoleOptions,
			this.userStatuses,
			this.userOptions,
			this.user,
			this.userUserOptions,
		];
	}

	async send() {
		try {
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessStatus.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.accessOption.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.access.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleStatus.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.roleOption.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.role.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.userStatus.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.userStatus.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.userOption.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.user.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.user.one`);
			await this.cacheService.clear(`${process.env.APP_ID}.setting.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.setting.one`);

			await Bluebird.each(this.seeders, async (seeder) => {
				this.logger.log(`Seeding ${seeder.constructor.name}`);
				
				await seeder.send();
			});
		}
		catch (err) {
			console.error(`ERROR send: ${err.message}`);
		}
	}
}
