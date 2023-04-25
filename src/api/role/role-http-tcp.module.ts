import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { RoleHttpTcpController } from './role-http-tcp.controller';

@Module({
	controllers: [ RoleHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService,
	],
})
export class RoleHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
