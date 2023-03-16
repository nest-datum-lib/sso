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
import { RoleStatusService } from './role-status.service';
import { RoleStatusTcpController } from './role-status-tcp.controller';
import { RoleStatus } from './role-status.entity';

@Module({
	controllers: [ RoleStatusTcpController ],
	imports: [
		TypeOrmModule.forFeature([ RoleStatus ]),
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
		RoleStatusService, 
	],
})
export class RoleStatusTcpModule {
}

