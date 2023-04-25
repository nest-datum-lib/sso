import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { AccessAccessOptionService } from './access-access-option.service';
import { AccessAccessOptionTcpController } from './access-access-option-tcp.controller';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { Access } from '../access/access.entity';
import { AccessAccessOption } from './access-access-option.entity';

@Module({
	controllers: [ AccessAccessOptionTcpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			AccessOption,
			AccessAccessOption,
			Access,
			AccessAccessAccessOption, 
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		AccessAccessOptionService, 
	],
})
export class AccessAccessOptionTcpModule {
}

