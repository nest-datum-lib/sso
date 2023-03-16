import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { 
	SqlModule,
	SqlService, 
} from '@nest-datum/sql';
import { AccessOptionService } from './access-option.service';
import { AccessOptionTcpController } from './access-option-tcp.controller';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { Access } from '../access/access.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessOption } from './access-option.entity';

@Module({
	controllers: [ AccessOptionTcpController ],
	imports: [
		TypeOrmModule.forFeature([
			AccessOption,
			AccessAccessOption,
			Access,
			AccessAccessAccessOption,
		]),
		ReplicaModule,
		TransportModule,
		CacheModule,
		SqlModule,
	],
	providers: [
		ReplicaService,
		TransportService,
		CacheService,
		SqlService,
		AccessOptionService, 
	],
})
export class AccessOptionTcpModule {
}

