import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { SettingService } from './setting.service';
import { SettingTcpController } from './setting-tcp.controller';
import { Setting } from './setting.entity';

@Module({
	controllers: [ SettingTcpController ],
	imports: [
		TypeOrmModule.forFeature([ Setting ]),
		CacheModule,
	],
	providers: [
		CacheService,
		SettingService, 
	],
})
export class SettingTcpModule {
}

