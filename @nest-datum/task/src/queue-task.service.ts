import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ReplicaService } from '@nest-datum/replica';
import { LoopService } from '@nest-datum/queue';
import { 
	obj as utilsCheckObj,
	str as utilsCheckStr,
	strName as utilsCheckStrName,
	numericInt as utilsCheckNumericInt,
	exists as utilsCheckExists,
} from '@nest-datum-utils/check';
import { TaskService } from './task.service';

@Injectable()
export class QueueTaskService extends TaskService {
	protected type = 'queue';
	protected currentAttempt = 0;
	protected attemptsCount = 3;
	protected delay = 0;
	protected createdAt;
	protected repeatedAt;
	protected payload;

	constructor(
		@InjectRedis(process['REDIS_QUEUE']) protected redisService: Redis,
		protected replicaService: ReplicaService,
		protected loopService: LoopService,
	) {
		super();
	}

	setOptions(options: object, inLoop = false) {
		this.attemptsCount = options['attemptsCount'] || this.attemptsCount;
		this.delay = options['attemptsCount'] || this.delay;
		this.currentAttempt = options['currentAttempt'] || 0;
		this.repeatedAt = options['repeatedAt'];
		
		return super.setOptions(options, inLoop);
	}

	getOptions() {
		return {
			...super.getOptions(),
			attemptsCount: this.attemptsCount,
			delay: this.delay,
			currentAttempt: this.currentAttempt,
			repeatedAt: this.repeatedAt,
		};
	}

	listen() {
		this.loopService.set(this.getName(), this.delay, this.processWrapper.bind(this));

		return this;
	}

	protected async takeOver(name: string, data: any): Promise<any> {
		return await this.redisService.rpush(name, String(data));
	}

	protected async validateInputWrapper(options) {
		const processedOptions = await super.validateInputWrapper(options);

		if (utilsCheckExists(options['attemptsCount'])
			&& !utilsCheckNumericInt(options['attemptsCount'])) {
			throw new Error(`Property attemptsCount "${options['attemptsCount']}" is not valid.`);
		}
		if (utilsCheckExists(options['delay'])
			&& !utilsCheckNumericInt(options['delay'])) {
			throw new Error(`Property delay "${options['delay']}" is not valid.`);
		}
		if (utilsCheckExists(options['currentAttempt'])
			&& !utilsCheckNumericInt(options['currentAttempt'])) {
			throw new Error(`Property currentAttempt "${options['currentAttempt']}" is not valid.`);
		}
		return {
			...options,
			...processedOptions,
		};
	}

	protected async processWrapper(timestamp: Date) {
		const queueName = this.replicaService.prefix(`${this.type}|${this.constructor.name}`);
		const optionsStr = await this.redisService.lindex(queueName, 0);
		let optionsParsed;

		if (utilsCheckStr(optionsStr)) {
			await this.redisService.lrem(queueName, 1, optionsStr);

			try {
				optionsParsed = JSON.parse(optionsStr);
			}
			catch (err) {
				console.log(`TaskService processWrapper task object in redis is not json.`, err.message);
			}
			if (utilsCheckObj(optionsParsed)) {
				const onNextList = optionsParsed['onNextList'];
				const onErrorList = optionsParsed['onErrorList'];

				delete optionsParsed['onNextList'];
				delete optionsParsed['onErrorList'];

				const optionsProcessed = this.setOptions(await this.validateInputWrapper(optionsParsed));

				optionsProcessed['onNextList'] = onNextList;
				optionsProcessed['onErrorList'] = onErrorList;

				try {
					if (optionsProcessed['attemptsCount'] !== this.attemptsCount) {
						optionsProcessed['attemptsCount'] = (this.attemptsCount >= 1)
							? this.attemptsCount
							: 1;
					}
					if (!(optionsProcessed['currentAttempt'] >= 0)) {
						optionsProcessed['currentAttempt'] = 0;
					}
					const output = await this.process(timestamp, optionsProcessed['payload']);

					return await this.onNextWrapper(timestamp, optionsProcessed, output);
				}
				catch (err) {
					console.log('Task process error: ', err);

					optionsProcessed['currentAttempt'] += 1;
					optionsProcessed['repeatedAt'] = new Date();

					await this.onErrorWrapper(err, timestamp, optionsProcessed);

					if (optionsProcessed['currentAttempt'] < optionsProcessed['attemptsCount']) {
						try {
							await this.redisService.rpush(queueName, JSON.stringify(optionsProcessed));
						}
						catch (err) {
							console.error(`Increase attempt value in "${this.getName()} ${this.getId()}" queue.`, err);
						}
					}
				}
			}
		}
	}
}
