import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { SettingHttpTcpController } from './setting-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ SettingHttpTcpController ],
	providers: [ 
		TransportService, 
	],
})
export class SettingHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
