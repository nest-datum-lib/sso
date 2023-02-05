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
import { RoleAccessService } from './role-access.service';
import { RoleAccessController } from './role-access.controller';
import { Access } from '../access/access.entity';
import { Role } from '../role/role.entity';
import { RoleAccess } from './role-access.entity';

@Module({
	controllers: [ RoleAccessController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Access,
			Role,
			RoleAccess,
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
		RoleAccessService, 
	],
})
export class RoleAccessModule {
}

