import { RedisModule as NestjsRedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	RedisModule,
	RedisService, 
} from '@nest-datum/redis';
import { redis } from '@nest-datum-common/config';
import { QueueService } from './queue.service';
import { LoopService } from './loop.service';

@Module({
	controllers: [],
	imports: [
		NestjsRedisModule.forRoot(redis),
		ReplicaModule,
		RedisModule,
	],
	providers: [ 
		ReplicaService,
		RedisService,
		QueueService,
		LoopService,
	],
})
export class QueueModule {
}
