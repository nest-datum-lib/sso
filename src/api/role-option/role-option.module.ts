import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleOption } from './role-option.entity';
import { RoleOptionService } from './role-option.service';
import { RoleOptionController } from './role-option.controller';

@Module({
	controllers: [ RoleOptionController ],
	imports: [
		TypeOrmModule.forFeature([ 
			RoleOption,
			RoleRoleOption, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		RoleOptionService, 
	],
})
export class RoleOptionModule {
}


