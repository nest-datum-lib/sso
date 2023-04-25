import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { AccessService } from './access.service';
import { AccessHttpTcpController } from './access-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ AccessHttpTcpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessService,
	],
})
export class AccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
