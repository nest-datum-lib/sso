import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';
import {
	get as envGet,
	set as envSet,
} from '@nest-datum-utils/env';

@Injectable()
export class ReplicaService {
	prefix(key: string, id?: string, name?: string) {
		return `${process.env.USER_ID}|${process.env.PROJECT_ID}|${name || process.env.APP_NAME}|${id || this.id()}|${key}`;
	}

	id(): string {
		let value = process.env.APP_ID || envGet('APP_ID');

		if (!utilsCheckStrId(value)) {
			value = uuidv4();
			process.env['APP_ID'] = value;

			envSet('APP_ID', value);
		}
		return value;
	}
}
