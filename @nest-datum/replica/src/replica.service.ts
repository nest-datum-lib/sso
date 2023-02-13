import { Injectable } from '@nestjs/common';
import { 
	all as envAll,
	get as envGet, 
} from '@nest-datum-utils/env';

@Injectable()
export class ReplicaService {
	/**
	 * Concatenates a string parameter with a wildcard phrase to form keys in a redis. The character "*" will be used by default.
	 * 
	 * @param {string} value - A string parameter from which the key will be generated.
	 * @example
	 * // returns `queue-user1|project1|myString`
	 * this.redisService.prefix('myString')
	 * @example
	 * // returns `queue-user1|project1|*`
	 * this.redisService.prefix()
	 * @returns {string}
	 */
	prefix(value?: string): string {
		return `${process.env.USER_ID}|${process.env.PROJECT_ID}|${String(value || '')}`;
	}

	setting(name: string) {
		const nameEnv = name.toUpperCase();

		return process.env[nameEnv] || envGet(nameEnv);
	}

	settings() {
		const data = envAll();
		let key,
			output = {};

		for (key in data) {
			output[key.toLowerCase()] = data[key];
		}
		return output;
	}
}
