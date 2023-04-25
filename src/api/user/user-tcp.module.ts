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
import { UserService } from './user.service';
import { UserTcpController } from './user-tcp.controller';
import { UserOption } from '../user-option/user-option.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';

@Module({
	controllers: [ UserTcpController ],
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
		UserService,
	],
})
export class UserTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
