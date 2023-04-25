import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionHttpTcpController } from './option-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ OptionHttpTcpController ],
	providers: [ 
		TransportService, 
	],
})
export class OptionHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
