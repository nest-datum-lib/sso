import { 
	Module,
	NestModule,
	MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { UserOptionService } from './user-option.service';
import { UserOptionHttpController } from './user-option-http.controller';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from '../user/user.entity';
import { UserOption } from './user-option.entity';

@Module({
	controllers: [ UserOptionHttpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			UserOption,
			UserUserOption,
			User, 
		]),
		CacheModule,
	],
	providers: [ 
		CacheService,
		UserOptionService,
	],
})
export class UserOptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
