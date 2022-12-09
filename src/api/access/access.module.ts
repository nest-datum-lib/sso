import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Role } from '../role/role.entity';
import { RoleAccess } from '../role-access/role-access.entity';
import { AccessStatus } from '../access-status/access-status.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';

@Module({
	controllers: [ AccessController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Role,
			RoleAccess, 
			AccessStatus,
			AccessAccessAccessOption,
			AccessAccessOption,
			Access,
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		AccessService, 
	],
})
export class AccessModule {
}

