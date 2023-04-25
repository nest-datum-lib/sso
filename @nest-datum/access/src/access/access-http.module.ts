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
import { AccessHttpController } from './access-http.controller';

@Module({
	imports: [],
	controllers: [ AccessHttpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessService,
	],
})
export class AccessHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
