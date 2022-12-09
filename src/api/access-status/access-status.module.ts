import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Access } from '../access/access.entity';
import { AccessStatus } from './access-status.entity';
import { AccessStatusService } from './access-status.service';
import { AccessStatusController } from './access-status.controller';

@Module({
	controllers: [ AccessStatusController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Access,
			AccessStatus, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		AccessStatusService, 
	],
})
export class AccessStatusModule {
}
