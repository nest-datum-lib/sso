import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { User } from '../user/user.entity';
import { UserStatus } from './user-status.entity';
import { UserStatusService } from './user-status.service';
import { UserStatusController } from './user-status.controller';

@Module({
	controllers: [ UserStatusController ],
	imports: [
		TypeOrmModule.forFeature([ 
			User,
			UserStatus, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		UserStatusService, 
	],
})
export class UserStatusModule {
}
