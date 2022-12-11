import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { AccessAccessOptionController } from './access-access-option.controller';
import { AccessAccessOptionService } from './access-access-option.service';
import { AccessAccessOption } from './access-access-option.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { Access } from '../access/access.entity';

@Module({
	controllers: [ AccessAccessOptionController ],
	imports: [
		TypeOrmModule.forFeature([ 
			AccessAccessOption,
			AccessAccessAccessOption,
			AccessOption,
			Access, 
		]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		AccessAccessOptionService, 
	],
})
export class AccessAccessOptionModule {
}
