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
import { SettingService } from './setting.service';
import { SettingTcpController } from './setting-tcp.controller';
import { Setting } from './setting.entity';

@Module({
	controllers: [ SettingTcpController ],
	imports: [
		TypeOrmModule.forFeature([ Setting ]),
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
		SettingService, 
	],
})
export class SettingTcpModule {
}

