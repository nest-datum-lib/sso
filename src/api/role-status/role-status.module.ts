import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Role } from '../role/role.entity';
import { RoleStatus } from './role-status.entity';
import { RoleStatusService } from './role-status.service';
import { RoleStatusController } from './role-status.controller';

@Module({
	controllers: [ RoleStatusController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Role,
			RoleStatus, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		RoleStatusService, 
	],
})
export class RoleStatusModule {
}
