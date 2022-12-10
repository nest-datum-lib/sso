import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { RoleAccess } from './role-access.entity';
import { RoleAccessController } from './role-access.controller';
import { RoleAccessService } from './role-access.service';
import { Role } from '../role/role.entity';
import { Access } from '../access/access.entity';

@Module({
	controllers: [ RoleAccessController ],
	imports: [
		TypeOrmModule.forFeature([ 
			RoleAccess,
			Role,
			Access, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		RoleAccessService, 
	],
})
export class RoleAccessModule {
}

