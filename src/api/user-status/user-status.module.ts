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
import { UserStatusService } from './user-status.service';
import { UserStatusController } from './user-status.controller';
import { UserStatus } from './user-status.entity';

@Module({
	controllers: [ UserStatusController ],
	imports: [
		TypeOrmModule.forFeature([ UserStatus ]),
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
		UserStatusService, 
	],
})
export class UserStatusModule {
}

