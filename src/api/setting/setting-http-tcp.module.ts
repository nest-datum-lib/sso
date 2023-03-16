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
import { SettingHttpTcpController } from './setting-http-tcp.controller';

@Module({
	imports: [ 
		ReplicaModule,
		TransportModule, 
	],
	controllers: [ SettingHttpTcpController ],
	providers: [ 
		ReplicaService,
		TransportService, 
	],
})
export class SettingHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
