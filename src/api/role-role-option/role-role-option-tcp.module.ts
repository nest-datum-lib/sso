import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { RoleRoleOptionService } from './role-role-option.service';
import { RoleRoleOptionTcpController } from './role-role-option-tcp.controller';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';
import { RoleRoleOption } from './role-role-option.entity';

@Module({
	controllers: [
		RoleRoleOptionTcpController, 
	],
	imports: [
		TypeOrmModule.forFeature([ 
			RoleOption,
			RoleRoleOption,
			Role,
			RoleRoleRoleOption, 
		]),
		CacheModule,
	],
	providers: [ 
		CacheService,
		RoleRoleOptionService,
	],
})
export class RoleRoleOptionTcpModule {
}
