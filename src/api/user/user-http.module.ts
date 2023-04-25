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
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { UserUserOptionService } from '../user-user-option/user-user-option.service';
import { UserService } from './user.service';
import { UserHttpController } from './user-http.controller';
import { UserOption } from '../user-option/user-option.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';

@Module({
	controllers: [ UserHttpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			UserOption,
			UserUserOption,
			User,
		]),
		TransportModule,
		CacheModule,
	],
	providers: [ 
		TransportService,
		CacheService,
		UserUserOptionService,
		UserService,
	],
})
export class UserHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
