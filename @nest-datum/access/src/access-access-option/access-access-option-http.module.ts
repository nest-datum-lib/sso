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
import { AccessAccessOptionService } from './access-access-option.service';
import { AccessAccessOptionHttpController } from './access-access-option-http.controller';

@Module({
	imports: [],
	controllers: [ AccessAccessOptionHttpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessAccessOptionService,
	],
})
export class AccessAccessOptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
