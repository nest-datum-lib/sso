import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { UserStatus } from '../user-status/user-status.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
	controllers: [ UserController ],
	imports: [
		TypeOrmModule.forFeature([ 
			User,
			UserStatus,
			UserUserOption,
			User, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		UserService, 
	],
})
export class UserModule {
}

