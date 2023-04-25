import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusHttpController } from './status-http.controller';

@Module({
	imports: [],
	controllers: [ StatusHttpController ],
	providers: [ 
		StatusService,
	],
})
export class StatusHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
