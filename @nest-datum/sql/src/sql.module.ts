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
import { SqlService } from './sql.service';

@Module({
	imports: [ 
		ReplicaModule,
		CacheModule, 
	],
	controllers: [],
	providers: [ 
		ReplicaService,
		CacheService,
		SqlService,
	],
})
export class SqlModule {
}
