import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';
import { 
	func as utilsCheckFunc,
	str as utilsCheckStr,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';

const _timeouts = {
	loop: (async () => {}),
	task: [],
	exists: false,
};

@Injectable()
export class TaskService {
	private _payload = {};
	protected onNextWithCancel?: Function;
	protected redisService;
	protected replicaService;
	protected loopService;

	/**
	 * The total number of attempts to try the job until it completes.
	 * @type {number}
	 */
	public attempts = 3;

	/**
	 * An amount of time (milliseconds) to wait until this job can be processed. Note that for accurate delays, both server and clients should have their clocks synchronized.
	 * @type {number}
	 */
	public delay = 0;

	payload(payload?: object) {
		payload = payload
			? (this._payload = payload)
			: (this._payload);

		if (!payload['taskId']) {
			payload['taskId'] = uuidv4();
		}
		if (!payload['createdAt']) {
			payload['createdAt'] = new Date();
		}
		if (!utilsCheckNumericInt(payload['currentAttempt'])) {
			payload['currentAttempt'] = 0;
		}
		payload['taskName'] = this.constructor.name;
		payload['delay'] = this.delay;
		payload['attempts'] = this.attempts;

		const processedPayload = { ...payload };

		delete processedPayload['taskId'];
		delete processedPayload['createdAt'];
		delete processedPayload['currentAttempt'];
		delete processedPayload['taskName'];
		delete processedPayload['delay'];
		delete processedPayload['attempts'];

		return (this._payload = processedPayload);
	}

	async start(payload: object): Promise<any> {
		const processedPayload = this.payload(payload);
		const validatedPayload = await this.validatePayload(processedPayload);

		this.loopService.eventHandlers({
			onError: this.onError,
			onNext: this.onNext,
			onNextWithCancel: this.onNextWithCancel,
		});
		return await this.redisService.rpush(`${this.replicaService.prefix(`queue|${validatedPayload['taskName']}|${validatedPayload['taskId']}`)}`, JSON.stringify(validatedPayload));
	}

	async process(timestamp?: Date): Promise<any> {
		return timestamp;
	}

	async processWrapper(timestamp?: Date) {
		const taskData = this.payload();
		const taskName = this.constructor.name;
		const taskQueueName = `${this.replicaService.prefix(`queue|${taskName}|${taskData['taskId']}`)}`;
		const dataRedisStr = await this.redisService.lindex(taskQueueName, 0);

		if (utilsCheckStr(dataRedisStr)) {
			const dataRedis = JSON.parse(dataRedisStr);

			try {
				this.redisService.lrem(taskQueueName, 1, dataRedisStr);

				if (dataRedis['attempts'] !== this.attempts) {
					dataRedis['attempts'] = (this.attempts >= 1)
						? this.attempts
						: 1;
				}
				if (!(dataRedis['currentAttempt'] >= 0)) {
					dataRedis['currentAttempt'] = 0;
				}
				await this.before(timestamp);

				return await this.after(await this.process(timestamp));
			}
			catch (err) {
				dataRedis['currentAttempt'] += 1;
				dataRedis['repeatedAt'] = new Date();

				if (dataRedis['currentAttempt'] < dataRedis['attempts']) {
					try {
						await this.redisService.rpush(taskQueueName, JSON.stringify(await this.validatePayload(this.payload())));
					}
					catch (err) {
						console.error(`Increase attempt value in "${taskName} ${taskData['taskId']}" queue.`, err);
					}
				}
			}
		}
	}

	async listen(): Promise<any> {
		return await this.loopService.set(this.constructor.name, this.delay, this.processWrapper.bind(this));
	}

	async onNext(): Promise<any> {
	}

	async onError(err): Promise<any> {
	}

	protected async validatePayload(payload: object): Promise<any> {
		return payload;
	}

	protected async before(timestamp: Date): Promise<any> {
		return timestamp;
	}

	protected async after(data: any): Promise<any> {
		return data;
	}
}
