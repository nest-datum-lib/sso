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
import { UserStatusService } from './user-status.service';
import { UserStatusHttpController } from './user-status-http.controller';
import { UserStatus } from './user-status.entity';

@Module({
	controllers: [ UserStatusHttpController ],
	imports: [
		TypeOrmModule.forFeature([ UserStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		UserStatusService, 
	],
})
export class UserStatusHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
