import { RedisModule as NestjsRedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { redis } from '@nest-datum-common/config';
import { ReplicaService } from '@nest-datum/replica';
import {
	RedisModule,
	RedisService,
} from '../../redis';
import { CacheService } from './cache.service';

@Module({
	imports: [ 
		NestjsRedisModule.forRoot(redis),
		RedisModule, 
	],
	controllers: [],
	providers: [ 
		ReplicaService,
		RedisService,
		CacheService,
	],
})
export class CacheModule {
}
