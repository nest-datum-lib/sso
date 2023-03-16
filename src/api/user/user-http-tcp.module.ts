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
import { UserHttpTcpController } from './user-http-tcp.controller';

@Module({
	imports: [ 
		ReplicaModule,
		TransportModule, 
	],
	controllers: [ UserHttpTcpController ],
	providers: [ 
		ReplicaService,
		TransportService, 
	],
})
export class UserHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
