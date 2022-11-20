import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from '@nest-datum/services';
import { typeormConfig } from 'config/typeorm';
import { redisConfig } from 'config/redis';
import { SeedService } from './seed.service';
import { Setting } from 'src/api/setting/setting.entity';
import { AccessStatus } from 'src/api/access-status/access-status.entity';
import { AccessOption } from 'src/api/access-option/access-option.entity';
import { AccessAccessOption } from 'src/api/access-access-option/access-access-option.entity';
import { AccessAccessAccessOption } from 'src/api/access-access-access-option/access-access-access-option.entity';
import { Access } from 'src/api/access/access.entity';
import { AccessStatusSeeder } from './access-status.seeder';
import { AccessOptionSeeder } from './access-option.seeder';
import { AccessAccessOptionSeeder } from './access-access-option.seeder';
import { AccessSeeder } from './access.seeder';
import { RoleAccess } from 'src/api/role-access/role-access.entity';
import { RoleStatus } from 'src/api/role-status/role-status.entity';
import { RoleOption } from 'src/api/role-option/role-option.entity';
import { RoleRoleOption } from 'src/api/role-role-option/role-role-option.entity';
import { RoleRoleRoleOption } from 'src/api/role-role-role-option/role-role-role-option.entity';
import { Role } from 'src/api/role/role.entity';
import { RoleStatusSeeder } from './role-status.seeder';
import { RoleOptionSeeder } from './role-option.seeder';
import { RoleRoleOptionSeeder } from './role-role-option.seeder';
import { RoleSeeder } from './role.seeder';
import { UserStatus } from 'src/api/user-status/user-status.entity';
import { UserOption } from 'src/api/user-option/user-option.entity';
import { UserUserOption } from 'src/api/user-user-option/user-user-option.entity';
import { User } from 'src/api/user/user.entity';
import { UserStatusSeeder } from './user-status.seeder';
import { UserOptionSeeder } from './user-option.seeder';
import { UserUserOptionSeeder } from './user-user-option.seeder';
import { UserSeeder } from './user.seeder';
import { SettingSeeder } from './setting.seeder';

@Module({
	controllers: [],
	imports: [
		TypeOrmModule.forRoot(typeormConfig),
		RedisModule.forRoot(redisConfig),
		TypeOrmModule.forFeature([
			RoleAccess,
			AccessStatus,
			AccessOption,
			RoleStatus,
			RoleOption,
			UserStatus,
			UserOption,
			Setting,
			AccessAccessOption,
			AccessAccessAccessOption,
			Access,
			RoleRoleRoleOption,
			RoleRoleOption,
			Role,
			User,
			UserUserOption,
		]),
	],
	providers: [
		CacheService,
		SeedService,
		AccessStatusSeeder,
		AccessOptionSeeder,
		RoleStatusSeeder,
		RoleOptionSeeder,
		UserStatusSeeder,
		UserOptionSeeder,
		SettingSeeder,
		AccessAccessOptionSeeder,
		// AccessAccessAccessOptionSeeder,
		AccessSeeder,
		RoleRoleOptionSeeder,
		// RoleRoleRoleOptionSeeder,
		RoleSeeder,
		UserSeeder,
		UserUserOptionSeeder,
	]
})

export class SeedModule {

}
