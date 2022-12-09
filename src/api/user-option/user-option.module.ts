import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserOption } from './user-option.entity';
import { UserOptionService } from './user-option.service';
import { UserOptionController } from './user-option.controller';

@Module({
	controllers: [ UserOptionController ],
	imports: [
		TypeOrmModule.forFeature([ 
			UserOption,
			UserUserOption, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		UserOptionService, 
	],
})
export class UserOptionModule {
}


