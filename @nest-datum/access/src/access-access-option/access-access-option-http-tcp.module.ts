import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { AccessAccessOptionService } from './access-access-option.service';
import { AccessAccessOptionHttpTcpController } from './access-access-option-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ AccessAccessOptionHttpTcpController ],
	providers: [ 
		AccessAccessOptionService, 
	],
})
export class AccessAccessOptionHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
