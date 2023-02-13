import Redis from 'ioredis';

/**
 * Functional wrapper over the Redis (ioredis) service. Provides functions for generating keys and template queries to redis.
 */
export class RedisService {
	public readonly redisService;

	async keysScan(match: string, callback: Function = async (item, index) => item): Promise<Array<any>> {
		try {
			const output = [];

			await (new Promise(async (resolve, reject) => {
				(await this.redisService.scanStream({
					match: `*${match}*`,
					count: 64,
				}))
					.on('data', async (resultKeys) => {
						let i = 0;

						while (i < resultKeys.length) {
							try {
								output.push(await callback(resultKeys[i], i));
							}
							catch (err) {
								return reject(err);
							}
							i++;
						}
					})
					.on('end', () => resolve(output));
			}));
			return output;
		}
		catch (err) {
			console.log(`Redis service error: ${err.message} { match: "${match}" }]`);
		}
		return [];
	}
}
