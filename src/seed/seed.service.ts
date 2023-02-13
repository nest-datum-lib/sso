import { Promise as Bluebird } from 'bluebird';
import { Connection } from 'typeorm';
import {
	Injectable,
	Logger,
} from '@nestjs/common';
import { CacheService } from '@nest-datum/cache';
import { SettingSeeder } from './setting.seeder';
import { AccessStatusSeeder } from './access-status.seeder';
import { AccessSeeder } from './access.seeder';
import { RoleStatusSeeder } from './role-status.seeder';
import { RoleSeeder } from './role.seeder';
import { UserStatusSeeder } from './user-status.seeder';
import { UserOptionSeeder } from './user-option.seeder';
import { UserSeeder } from './user.seeder';
import { UserUserOptionSeeder } from './user-user-option.seeder';

@Injectable()
export class SeedService {
	private readonly seeders = [];
	private readonly logger = new Logger(SeedService.name);

	constructor(
		private readonly cacheService: CacheService,
		private readonly connection: Connection,
		private readonly settings: SettingSeeder,
		private readonly accessStatus: AccessStatusSeeder,
		private readonly access: AccessSeeder,
		private readonly roleStatus: RoleStatusSeeder,
		private readonly role: RoleSeeder,
		private readonly userStatus: UserStatusSeeder,
		private readonly userOption: UserOptionSeeder,
		private readonly user: UserSeeder,
		private readonly userUserOption: UserUserOptionSeeder,
	) {
		this.seeders = [
			this.settings,
			this.accessStatus,
			this.access,
			this.roleStatus,
			this.role,
			this.userStatus,
			this.userOption,
			this.user,
			this.userUserOption,
		];
	}

	async send() {
		try {
			await this.cacheService.clear([ 'setting', 'many' ]);
			await this.cacheService.clear([ 'setting', 'one' ]);
			await this.cacheService.clear([ 'accessStatus', 'many' ]);
			await this.cacheService.clear([ 'accessStatus', 'one' ]);
			await this.cacheService.clear([ 'access', 'many' ]);
			await this.cacheService.clear([ 'access', 'one' ]);
			await this.cacheService.clear([ 'roleStatus', 'many' ]);
			await this.cacheService.clear([ 'roleStatus', 'one' ]);
			await this.cacheService.clear([ 'role', 'many' ]);
			await this.cacheService.clear([ 'role', 'one' ]);
			await this.cacheService.clear([ 'userStatus', 'many' ]);
			await this.cacheService.clear([ 'userStatus', 'one' ]);
			await this.cacheService.clear([ 'userOption', 'many' ]);
			await this.cacheService.clear([ 'userOption', 'one' ]);
			await this.cacheService.clear([ 'user', 'many' ]);
			await this.cacheService.clear([ 'user', 'one' ]);
			await this.cacheService.clear([ 'userUserOption', 'many' ]);
			await this.cacheService.clear([ 'userUserOption', 'one' ]);

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
