import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ErrorException } from '@nest-datum-common/exceptions';
import { RedisService } from '@nest-datum/redis';
import { ReplicaService } from '@nest-datum/replica';
import { 
	obj as utlisCheckObj,
	strExists as utilsCheckStrExists, 
} from '@nest-datum-utils/check';

const timeouts = {};
const tmp = {};

@Injectable()
export class CacheService extends RedisService {
	constructor(
		@InjectRedis(process['REDIS_CACHE']) public redisService: Redis,
		private readonly replicaService: ReplicaService,
	) {
		super();
	}

	getKey(query: Array<any>): string {
		let key = '',
			i = 0;

		while (i < query.length) {
			if (!query[i]) {
				throw new ErrorException(`Cache query item is undefined.`);
			}
			if (utlisCheckObj(query[i])) {
				const processedItem = { ...query[i] };

				delete processedItem['accessToken'];
				delete processedItem['refreshToken'];
				delete processedItem['userId'];

				key += JSON.stringify(processedItem);
			}
			else {
				key += String(query[i]);
			}

			if (i < (query.length - 1)) {
				key += '|';
			}
			i++;
		}
		return this.replicaService.prefix(`${this.replicaService.setting('app_id')}|${key}`);
	}

	async get(query: Array<any>): Promise<any> {
		const key = this.getKey(query);
		const output = tmp[key]
			? undefined
			: await this.redisService.get(key);

		if (utilsCheckStrExists(output)) {
			try {
				return JSON.parse(output);
			}
			catch (err) {
			}
		}
		return output;
	}

	async set(query: Array<any>, payload?: any): Promise<any> {
		return await this.redisService.set(this.getKey(query), utlisCheckObj(payload)
			? JSON.stringify(payload)
			: String(payload));
	}

	async clear(query: Array<any>): Promise<any> {
		const key = this.getKey(query);
		const cacheDataByKey = Number(await this.redisService.exists(key));

		tmp[key] = true;

		(cacheDataByKey) 
			? await this.redisService.del(key)
			: await this.keysScan(key, async (redisKey) => await this.redisService.del(redisKey));
		clearTimeout(timeouts[key]);

		timeouts[key] = setTimeout(() => {
			delete timeouts[key];
			delete tmp[key];
		}, 1000);

		return true;
	}
}
