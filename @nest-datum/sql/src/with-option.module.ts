import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	redis,
	sql, 
} from '@nest-datum-common/config';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { SqlModule } from './sql.module';
import { SqlService } from './sql.service';
import { WithOptionService } from './with-option.service';

@Module({
	imports: [ 
		ReplicaModule,
		CacheModule, 
		SqlModule,
	],
	controllers: [],
	providers: [ 
		ReplicaService,
		CacheService,
		SqlService,
		WithOptionService,
	],
})
export class WithOptionModule {
}
