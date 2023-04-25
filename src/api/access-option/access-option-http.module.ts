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
import { AccessOptionService } from './access-option.service';
import { AccessOptionHttpController } from './access-option-http.controller';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { Access } from '../access/access.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessOption } from './access-option.entity';

@Module({
	controllers: [ AccessOptionHttpController ],
	imports: [
		TypeOrmModule.forFeature([
			AccessOption,
			AccessAccessOption,
			Access,
			AccessAccessAccessOption,
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		AccessOptionService, 
	],
})
export class AccessOptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
