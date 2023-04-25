import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { UserStatusService } from './user-status.service';
import { UserStatusTcpController } from './user-status-tcp.controller';
import { UserStatus } from './user-status.entity';

@Module({
	controllers: [ UserStatusTcpController ],
	imports: [
		TypeOrmModule.forFeature([ UserStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		UserStatusService, 
	],
})
export class UserStatusTcpModule {
}

