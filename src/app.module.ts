import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'config/typeorm';
import { redisConfig } from 'config/redis';
import { BalancerModule } from 'nest-datum/balancer/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingModule } from './api/setting/setting.module';
import { AccessStatusModule } from './api/access-status/access-status.module';
import { AccessOptionModule } from './api/access-option/access-option.module';
import { AccessAccessOptionModule } from './api/access-access-option/access-access-option.module';
import { AccessAccessAccessOptionModule } from './api/access-access-access-option/access-access-access-option.module';
import { AccessModule } from './api/access/access.module';
import { RoleStatusModule } from './api/role-status/role-status.module';
import { RoleOptionModule } from './api/role-option/role-option.module';
import { RoleRoleRoleOptionModule } from './api/role-role-role-option/role-role-role-option.module';
import { RoleRoleOptionModule } from './api/role-role-option/role-role-option.module';
import { RoleModule } from './api/role/role.module';
import { RoleAccessModule } from './api/role-access/role-access.module';
import { UserStatusModule } from './api/user-status/user-status.module';
import { UserOptionModule } from './api/user-option/user-option.module';
import { UserUserOptionModule } from './api/user-user-option/user-user-option.module';
import { UserModule } from './api/user/user.module';

console.log('typeormConfig', typeormConfig);

@Module({
	imports: [
		TypeOrmModule.forRoot(typeormConfig),
		RedisModule.forRoot(redisConfig),
		BalancerModule,
		SettingModule,
		AccessStatusModule,
		AccessOptionModule,
		AccessAccessOptionModule,
		AccessAccessAccessOptionModule,
		AccessModule,
		RoleStatusModule,
		RoleOptionModule,
		RoleRoleRoleOptionModule,
		RoleRoleOptionModule,
		RoleModule,
		RoleAccessModule,
		UserStatusModule,
		UserOptionModule,
		UserUserOptionModule,
		UserModule,
	],
	controllers: [ AppController ],
	providers: [ AppService ],
})
export class AppModule {
}
