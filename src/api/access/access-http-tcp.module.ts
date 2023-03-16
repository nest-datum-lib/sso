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
import { AccessHttpTcpController } from './access-http-tcp.controller';

@Module({
	imports: [ 
		ReplicaModule,
		TransportModule, 
	],
	controllers: [ AccessHttpTcpController ],
	providers: [ 
		ReplicaService,
		TransportService, 
	],
})
export class AccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
