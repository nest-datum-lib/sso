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
import { RoleStatusService } from './role-status.service';
import { RoleStatusHttpController } from './role-status-http.controller';
import { RoleStatus } from './role-status.entity';

@Module({
	controllers: [ RoleStatusHttpController ],
	imports: [
		TypeOrmModule.forFeature([ RoleStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		RoleStatusService, 
	],
})
export class RoleStatusHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
