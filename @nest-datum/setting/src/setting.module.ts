import { Module } from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '../../transport/src';
import {
	CacheModule, 
	CacheService, 
} from '../../cache/src';
import { 
	SqlModule,
	SqlService, 
} from '@nest-datum/sql';
import { SettingService } from './setting.service';
import { SettingTcpController } from './setting-tcp.controller';
import { SettingHttpController } from './setting-http.controller';

@Module({
	controllers: [ 
		SettingTcpController,
		SettingHttpController, 
	],
	imports: [
		SqlModule,
		TransportModule,
		CacheModule,
	],
	providers: [
		TransportService,
		SqlService,
		CacheService,
		SettingService, 
	],
})
export class SettingModule {
}

