import { Module } from '@nestjs/common';
import { RedisModule as NestjsRedisModule } from '@liaoliaots/nestjs-redis';
import { redis } from '@nest-datum-common/config';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	RedisModule,
	RedisService, 
} from '@nest-datum/redis';
import { LoopService } from '@nest-datum/queue';
import { QueueTaskService } from './queue-task.service';

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
		LoopService,
		QueueTaskService,
	],
})
export class QueueTaskModule {
}
