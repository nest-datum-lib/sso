import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { AccessHttpTcpController } from './access-http-tcp.controller';

@Module({
	imports: [ 
		TransportModule, 
	],
	controllers: [ AccessHttpTcpController ],
	providers: [ 
		TransportService, 
	],
})
export class AccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
