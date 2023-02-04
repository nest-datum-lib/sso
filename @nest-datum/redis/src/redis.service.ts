import Redis from 'ioredis';

export class RedisService {
	public readonly redis;

	async redisScanStream(key: string, callback: Function = async (key, fullKey) => ({})): Promise<any> {
		try {
			const output = [];

			return await (new Promise(async (resolve, reject) => {
				let scanStream; 
						
				try {
					scanStream = await this.redis.scanStream({
						match: `*${key}*`,
						count: 64,
					});
				}
				catch (err) {
					return reject(err);
				}
				scanStream.on('data', async (resultKeys) => {
					let i = 0;

					while (i < resultKeys.length) {
						try {
							await callback(key, resultKeys[i]);

							output.push(resultKeys[i]);
						}
						catch (err) {
							return reject(err);
						}
						i++;
					}
				});
				scanStream.on('end', () => resolve(output));
			}));
		}
		catch (err) {
			return [];
		}
	}
}
