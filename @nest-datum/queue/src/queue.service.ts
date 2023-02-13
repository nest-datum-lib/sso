import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';
import { LoopService } from './loop.service';

@Injectable()
export class QueueService {
	protected tasklist = {};

	constructor(
		@InjectRedis(process['REDIS_QUEUE']) protected redisService: Redis,
		protected replicaService: ReplicaService,
		protected loopService: LoopService,
	) {
	}

	getTaskList() {
		return this.tasklist;
	}

	getTaskListArr() {
		return Object.values(this.getTaskList());
	}

	getTask(taskName: string) {
		return this.tasklist[taskName];
	}

	setTask(taskService) {
		this.tasklist[taskService.constructor.name] = (new taskService(this.redisService, this.replicaService, this.loopService));

		return this;
	}

	start() {
		(async () => {
			const tasklistProcessed = await this.getTaskListArr();

			if (tasklistProcessed.length === 0) {
				throw new Error(`Task list is empty.`);
			}
			let i = 0;

			while (i < tasklistProcessed.length) {
				await tasklistProcessed[i]['listen']();
				i++;
			}
		})();
		return this;
	}
}
