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
import { AccessStatusService } from './access-status.service';
import { AccessStatusTcpController } from './access-status-tcp.controller';
import { AccessStatus } from './access-status.entity';

@Module({
	controllers: [ AccessStatusTcpController ],
	imports: [
		TypeOrmModule.forFeature([ AccessStatus ]),
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
		AccessStatusService, 
	],
})
export class AccessStatusTcpModule {
}

