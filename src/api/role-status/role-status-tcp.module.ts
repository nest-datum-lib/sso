import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { RoleStatusService } from './role-status.service';
import { RoleStatusTcpController } from './role-status-tcp.controller';
import { RoleStatus } from './role-status.entity';

@Module({
	controllers: [ RoleStatusTcpController ],
	imports: [
		TypeOrmModule.forFeature([ RoleStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		RoleStatusService, 
	],
})
export class RoleStatusTcpModule {
}

