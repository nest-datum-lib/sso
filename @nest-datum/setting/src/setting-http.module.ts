import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingHttpController } from './setting-http.controller';

@Module({
	imports: [],
	controllers: [ SettingHttpController ],
	providers: [ 
		SettingService,
	],
})
export class SettingHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
