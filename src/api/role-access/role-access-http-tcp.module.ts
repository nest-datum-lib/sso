import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { RoleAccessHttpTcpController } from './role-access-http-tcp.controller';

@Module({
	controllers: [ RoleAccessHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService, 
	],
})
export class RoleAccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
