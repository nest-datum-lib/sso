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
import { AccessStatusService } from './access-status.service';
import { AccessStatusHttpController } from './access-status-http.controller';
import { AccessStatus } from './access-status.entity';

@Module({
	controllers: [ AccessStatusHttpController ],
	imports: [
		TypeOrmModule.forFeature([ AccessStatus ]),
		CacheModule,
	],
	providers: [
		CacheService,
		AccessStatusService, 
	],
})
export class AccessStatusHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
