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
import { QueueModule } from './queue.module';
import { QueueService } from './queue.service';
import { LoopService } from './loop.service';
import { TaskService } from './task.service';

@Module({
	controllers: [],
	imports: [
		NestjsRedisModule.forRoot(redis),
		ReplicaModule,
		RedisModule,
		QueueModule,
	],
	providers: [ 
		ReplicaService,
		RedisService,
		TaskService,
		QueueService,
		LoopService,
	],
})
export class TaskModule {
}
