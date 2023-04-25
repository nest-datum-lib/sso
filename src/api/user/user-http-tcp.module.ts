import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { UserHttpTcpController } from './user-http-tcp.controller';

@Module({
	controllers: [ UserHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService, 
	],
})
export class UserHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
