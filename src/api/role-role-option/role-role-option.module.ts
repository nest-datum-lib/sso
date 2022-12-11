import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { RoleRoleOptionController } from './role-role-option.controller';
import { RoleRoleOptionService } from './role-role-option.service';
import { RoleRoleOption } from './role-role-option.entity';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';

@Module({
	controllers: [ RoleRoleOptionController ],
	imports: [
		TypeOrmModule.forFeature([ 
			RoleRoleOption,
			RoleRoleRoleOption,
			RoleOption,
			Role, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		RoleRoleOptionService, 
	],
})
export class RoleRoleOptionModule {
}
