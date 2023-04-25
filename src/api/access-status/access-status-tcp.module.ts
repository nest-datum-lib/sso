import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { AccessStatusService } from './access-status.service';
import { AccessStatusTcpController } from './access-status-tcp.controller';
import { AccessStatus } from './access-status.entity';

@Module({
	controllers: [ AccessStatusTcpController ],
	imports: [
		TypeOrmModule.forFeature([ AccessStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		AccessStatusService, 
	],
})
export class AccessStatusTcpModule {
}

