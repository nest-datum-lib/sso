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
import { RoleHttpTcpController } from './role-http-tcp.controller';

@Module({
	imports: [ 
		ReplicaModule,
		TransportModule, 
	],
	controllers: [ RoleHttpTcpController ],
	providers: [ 
		ReplicaService,
		TransportService, 
	],
})
export class RoleHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
