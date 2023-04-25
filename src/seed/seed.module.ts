import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlConfig as utilsFormatSqlConfig } from '@nest-datum-utils/format';
import { SeedService } from './seed.service';
import { Setting } from '../api/setting/setting.entity';
import { Access } from '../api/access/access.entity';
import { AccessStatus } from '../api/access-status/access-status.entity';
import { AccessOption } from '../api/access-option/access-option.entity';
import { AccessAccessOption } from '../api/access-access-option/access-access-option.entity';
import { AccessAccessAccessOption } from '../api/access-access-access-option/access-access-access-option.entity';
import { Role } from '../api/role/role.entity';
import { RoleStatus } from '../api/role-status/role-status.entity';
import { RoleOption } from '../api/role-option/role-option.entity';
import { RoleRoleOption } from '../api/role-role-option/role-role-option.entity';
import { RoleRoleRoleOption } from '../api/role-role-role-option/role-role-role-option.entity';
import { RoleAccess } from '../api/role-access/role-access.entity';
import { User } from '../api/user/user.entity';
import { UserStatus } from '../api/user-status/user-status.entity';
import { UserOption } from '../api/user-option/user-option.entity';
import { UserUserOption } from '../api/user-user-option/user-user-option.entity';
import { SettingSeeder } from './setting.seeder';
import { AccessStatusSeeder } from './access-status.seeder';
import { AccessSeeder } from './access.seeder';
import { RoleStatusSeeder } from './role-status.seeder';
import { RoleSeeder } from './role.seeder';
import { UserStatusSeeder } from './user-status.seeder';
import { UserOptionSeeder } from './user-option.seeder';
import { UserSeeder } from './user.seeder';
import { UserUserOptionSeeder } from './user-user-option.seeder';

@Module({
	controllers: [],
	imports: [
		TypeOrmModule.forRoot(utilsFormatSqlConfig()),
		TypeOrmModule.forFeature([
			Setting,
			AccessStatus,
			AccessOption,
			Access,
			AccessAccessOption,
			AccessAccessAccessOption,
			RoleStatus,
			RoleOption,
			Role,
			RoleRoleOption,
			RoleRoleRoleOption,
			RoleAccess,
			UserStatus,
			UserOption,
			User,
			UserUserOption,
		]),
	],
	providers: [
		SeedService,
		SettingSeeder,
		AccessStatusSeeder,
		AccessSeeder,
		RoleStatusSeeder,
		RoleSeeder,
		UserStatusSeeder,
		UserOptionSeeder,
		UserSeeder,
		UserUserOptionSeeder,
	]
})

export class SeedModule {
}
