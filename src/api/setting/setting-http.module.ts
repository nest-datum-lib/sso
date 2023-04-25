import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { SettingService } from './setting.service';
import { SettingHttpController } from './setting-http.controller';
import { Setting } from './setting.entity';

@Module({
	controllers: [ SettingHttpController ],
	imports: [
		TypeOrmModule.forFeature([ Setting ]),
		CacheModule,
	],
	providers: [
		CacheService,
		SettingService, 
	],
})
export class SettingHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
