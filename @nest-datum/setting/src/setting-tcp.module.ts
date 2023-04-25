import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { SettingService } from './setting.service';
import { SettingTcpController } from './setting-tcp.controller';

@Module({
	imports: [],
	controllers: [ SettingTcpController ],
	providers: [ 
		SettingService,
	],
})
export class SettingTcpModule {
}
