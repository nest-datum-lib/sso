import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { User } from '../user/user.entity';
import { Access } from '../access/access.entity';
import { RoleAccess } from '../role-access/role-access.entity';
import { RoleStatus } from '../role-status/role-status.entity';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
	controllers: [ RoleController ],
	imports: [
		TypeOrmModule.forFeature([ 
			User,
			RoleAccess,
			RoleStatus,
			RoleRoleRoleOption,
			RoleRoleOption,
			Role,
			Access, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		RoleService, 
	],
})
export class RoleModule {
}

