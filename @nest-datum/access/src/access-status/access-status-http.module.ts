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
import { AccessStatusService } from './access-status.service';
import { AccessStatusHttpController } from './access-status-http.controller';

@Module({
	imports: [],
	controllers: [ AccessStatusHttpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessStatusService,
	],
})
export class AccessStatusHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
