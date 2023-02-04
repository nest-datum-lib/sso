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
import { SettingController } from './setting.controller';

@Module({
	controllers: [ SettingController ],
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

