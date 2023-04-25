import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { SettingHttpTcpController } from './setting-http-tcp.controller';

@Module({
	controllers: [ SettingHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService, 
	],
})
export class SettingHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
