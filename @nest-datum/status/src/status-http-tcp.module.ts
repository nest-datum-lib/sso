import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { StatusHttpTcpController } from './status-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ StatusHttpTcpController ],
	providers: [ 
		TransportService, 
	],
})
export class StatusHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
