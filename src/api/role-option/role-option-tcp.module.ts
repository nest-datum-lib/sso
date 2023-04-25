import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { RoleOptionService } from './role-option.service';
import { RoleOptionTcpController } from './role-option-tcp.controller';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from '../role/role.entity';
import { RoleOption } from './role-option.entity';

@Module({
	controllers: [
		RoleOptionTcpController, 
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
		RoleOptionService,
	],
})
export class RoleOptionTcpModule {
}
