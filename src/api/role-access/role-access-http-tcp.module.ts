import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { RoleAccessHttpTcpController } from './role-access-http-tcp.controller';

@Module({
	imports: [ 
		ReplicaModule,
		TransportModule, 
	],
	controllers: [ RoleAccessHttpTcpController ],
	providers: [ 
		ReplicaService,
		TransportService, 
	],
})
export class RoleAccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
