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
import { UserService } from './user.service';
import { UserTcpController } from './user-tcp.controller';
import { UserOption } from '../user-option/user-option.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';

@Module({
	controllers: [ UserTcpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			UserOption,
			User, 
			UserUserOption,
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
		UserService, 
	],
})
export class UserTcpModule {
}

