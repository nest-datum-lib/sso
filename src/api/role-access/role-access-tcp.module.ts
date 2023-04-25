import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { RoleAccessService } from './role-access.service';
import { RoleAccessTcpController } from './role-access-tcp.controller';
import { Access } from '../access/access.entity';
import { Role } from '../role/role.entity';
import { RoleAccess } from './role-access.entity';

@Module({
	controllers: [ RoleAccessTcpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Access,
			Role,
			RoleAccess,
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		RoleAccessService, 
	],
})
export class RoleAccessTcpModule {
}

