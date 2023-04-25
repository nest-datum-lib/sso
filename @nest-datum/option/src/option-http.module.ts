import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionHttpController } from './option-http.controller';

@Module({
	imports: [],
	controllers: [ OptionHttpController ],
	providers: [ 
		OptionService,
	],
})
export class OptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
