import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
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
import { 
	redis,
	sql, 
} from '@nest-datum-common/config';
import { SettingModule } from './api/setting/setting.module';
import { AccessModule } from './api/access/access.module';
import { AccessStatusModule } from './api/access-status/access-status.module';
import { AccessOptionModule } from './api/access-option/access-option.module';
import { AccessAccessOptionModule } from './api/access-access-option/access-access-option.module';

import { UserModule } from './api/user/user.module';
// import { UserStatusModule } from './api/user-status/user-status.module';
import { AppController } from './app.controller';

@Module({
	imports: [
		TypeOrmModule.forRoot(sql),
		RedisModule.forRoot(redis),
		ReplicaModule,
		TransportModule,
		CacheModule,
		SqlModule,
		SettingModule,
		AccessModule,
		AccessStatusModule,
		AccessOptionModule,
		AccessAccessOptionModule,

		UserModule,
		// UserStatusModule,
	],
	controllers: [ AppController ],
	providers: [
		ReplicaService,
		TransportService,
		CacheService,
		SqlService,
	],
})
export class AppModule {
}
