import { v4 as uuidv4 } from 'uuid';
import { find } from '@nest-datum-utils/env';

const configArr: Array<any> = find([ 'REDIS_', '_HOST' ], (key) => {
	process[`REDIS_${key}`] = uuidv4();

	return {
		namespace: process[`REDIS_${key}`],
		host: process.env[`REDIS_${key}_HOST`],
		port: Number(process.env[`REDIS_${key}_PORT`]),
		password: process.env[`REDIS_${key}_PASSWORD`],
		db: Number(process.env[`REDIS_${key}_DB`]),
	};
});

export const redis = {
	config: configArr,
};
