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
import { RoleOptionService } from './role-option.service';
import { RoleOptionTcpController } from './role-option-tcp.controller';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { Role } from '../role/role.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleOption } from './role-option.entity';

@Module({
	controllers: [ RoleOptionTcpController ],
	imports: [
		TypeOrmModule.forFeature([
			RoleOption,
			RoleRoleOption,
			Role,
			RoleRoleRoleOption,
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
		RoleOptionService, 
	],
})
export class RoleOptionTcpModule {
}

