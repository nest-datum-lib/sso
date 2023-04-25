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
import { AccessOptionService } from './access-option.service';
import { AccessOptionHttpController } from './access-option-http.controller';

@Module({
	imports: [],
	controllers: [ AccessOptionHttpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessOptionService,
	],
})
export class AccessOptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
