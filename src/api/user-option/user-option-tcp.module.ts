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
import { UserOptionService } from './user-option.service';
import { UserOptionTcpController } from './user-option-tcp.controller';
import { User } from '../user/user.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserOption } from './user-option.entity';

@Module({
	controllers: [ UserOptionTcpController ],
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
		UserOptionService, 
	],
})
export class UserOptionTcpModule {
}

