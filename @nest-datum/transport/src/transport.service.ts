import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { 
	ClientProxyFactory,
	Transport, 
} from '@nestjs/microservices';
import { 
	NotFoundException,
	WarningException,
	ErrorException, 
	NotificationException,
	Exception,
} from '@nest-datum-common/exceptions';
import {
	obj as utilsCheckObj,
	strId as utilsCheckStrId,
	strHost as utilsCheckStrHost,
	strName as utilsCheckStrName,
	strDescription as utilsCheckStrDescription,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';

const _savedInstance = {};

@Injectable()
export class TransportService extends RedisService {
	constructor(
		@InjectRedis(process['REDIS_TRANSPORT']) public redis: Redis,
		private readonly replicaService: ReplicaService,
	) {
		super();
	}

	connection({ id, host, port }: { id: string; host?: string; port?: string }): any {
		let connectionInstance = _savedInstance[id];

		if (!connectionInstance
			&& utilsCheckStrHost(host)
			&& utilsCheckNumericInt(port)) {
			connectionInstance = ClientProxyFactory.create({
				transport: Transport.TCP,
				options: {
					host: host,
					port: Number(port),
				},
			});
			_savedInstance[id] = connectionInstance;

			connectionInstance.connect();
		}
		return connectionInstance;
	}

	async isConnected(connectionInstance, { id, indicator }: { id: string; indicator?: number }): Promise<boolean> {
		try {
			let interval,
				index = 0;

			if (!connectionInstance['isConnected']) {
				await (new Promise((resolve, reject) => {
					interval = setInterval(() => {
						if (connectionInstance
							&& connectionInstance['isConnected']) {
							clearInterval(interval);
							resolve(true);
							return;
						}
						else if (index >= Number(process.env.APP_TRANSPORT_ATTEMPTS_RECONNCT || 3)) {
							clearInterval(interval);
							reject(new Error(`Service "${id}" is unavailable`));
							return;
						}
						index += 1;
					}, Number(process.env.APP_TRANSPORT_ATTEMPTS_RECONNCT_TIMEOUT || 200));
				}));
			}
			await this.incrementLoadingIndicator(id);

			return true;
		}
		catch (err) {
			delete _savedInstance[id];
			// await this.cancel(id);
		}
		return false;
	}

	async lessLoadedConnection({ id, name }: { id?: string; name?: string }): Promise<any> {
		let prefix = `${process.env.USER_ID}|${process.env.PROJECT_ID}|`,
			key,
			lessLoader,
			lessLoaderId,
			data = {};

		if (utilsCheckStrDescription(name)) {
			prefix += `${name}|`;

			if (utilsCheckStrId(id)) {
				prefix += `${id}|`;
			}
		}
		else if (utilsCheckStrId(id)) {
			prefix += `${id}|`;
		}
		const dataProcessed = (await this.redisScanStream(prefix));
		let i = 0;

		while (i < dataProcessed.length) {
			data[dataProcessed[i]] = await this.redis.get(dataProcessed[i]);
			i++;
		}

		for (key in data) {
			const keySplit = key.split('|');
			const currentId = keySplit[keySplit.length - 2];
			const currentValue = Number(data[key]);

			if (currentId !== process.env.APP_ID) {
				if (currentValue === 0) {
					lessLoaderId = currentId;
					break;
				}
				if (lessLoader > currentValue
					|| typeof lessLoader === 'undefined') {
					lessLoader = currentValue;
					lessLoaderId = currentId;
				}
			}
		}
		if (!utilsCheckStrId(lessLoaderId)) {
			return undefined;
		}
		return ({
			id: id || lessLoaderId,
			...JSON.parse(data[this.replicaService.prefix('address', lessLoaderId, name)] || await this.redis.get(this.replicaService.prefix('address', lessLoaderId))),
		});
	}

	async setLoadingIndicator(id?: string, initialValue?: number): Promise<any> {
		await this.redis.set(this.replicaService.prefix('loadingIndicator', id), String(initialValue || 0));
	}

	async incrementLoadingIndicator(id?: string): Promise<number> {
		let value;

		await this.setLoadingIndicator(id, (value = Number(await this.redis.get(this.replicaService.prefix('loadingIndicator'))) + 1));

		return value;
	}

	async decrementLoadingIndicator(id?: string): Promise<number> {
		let value;

		await this.setLoadingIndicator(id, (value = (Number(await this.redis.get(this.replicaService.prefix('loadingIndicator'))) || 1) - 1));

		return value;
	}

	async createOptions(options?: object): Promise<any> {
		await this.redis.set(this.replicaService.prefix('options'), JSON.stringify({
			id: this.replicaService.id(),
			createdAt: String(new Date()),
			...(options || {}),
		}));
	}

	async createAddress({ host, port }: { host?: string; port?: number }): Promise<any> {
		await this.redis.set(this.replicaService.prefix('address'), JSON.stringify({
			host: host || process.env.APP_HOST,
			port: port || process.env.APP_PORT,
		}));
	}

	async cancel(id?: string, name?: string): Promise<any> {
		const prefix = name
			? this.replicaService.prefix('address', id, name)
			: (await this.redisScanStream(`${id}|address`))[0];
		const prefixSplit = prefix.split('|');

		await this.redis.del(this.replicaService.prefix('address', prefixSplit[prefixSplit.length - 2], prefixSplit[prefixSplit.length - 3]));
		await this.redis.del(this.replicaService.prefix('options', prefixSplit[prefixSplit.length - 2], prefixSplit[prefixSplit.length - 3]));
		await this.redis.del(this.replicaService.prefix('loadingIndicator', prefixSplit[prefixSplit.length - 2], prefixSplit[prefixSplit.length - 3]));
	}

	async create(options: object = {}): Promise<boolean> {
		const host = options['host'] || process.env.APP_HOST
		const port = Number(options['port'] || process.env.APP_PORT);

		if (!utilsCheckStrHost(host)) {
			throw new Error('Replica host is undefiined. Add "APP_HOST" property to .env file or pass "host" parameter to create function.');
		}
		if (!utilsCheckNumericInt(port)) {
			throw new Error('Replica port is undefiined. Add "APP_PORT" property to .env file or pass "port" parameter to create function.');
		}
		await this.setLoadingIndicator();
		await this.createOptions(options);
		await this.createAddress({ host, port });

		await this.sendLog(new NotificationException(`Replica ${this.replicaService.id()} successfully created!`));
	
		return true;
	}

	async sendLog(exception: Exception): Promise<any> {
		try {
			await this.send({ 
				name: process.env.SERVICE_LOGS,
				cmd: exception.getCmd(), 
			}, exception.options());
		}
		catch (err) {
			if (utilsCheckObj(err)
				&& utilsCheckStrName(err['cmd'])) {
				if (err['errorCode'] !== 404) {
					throw new ErrorException(err.message);
				}
				console.log('sendLog', err.message, exception.options());
			}
			else {
				throw new err;
			}
		}
	}

	async send({ id, cmd, name }: { id?: string; cmd: string, name?: string }, payload: any): Promise<any> {
		const replicaData =  await this.lessLoadedConnection({ id, name });

		if (!replicaData) {
			throw new NotFoundException(`Replica "${id || name}" not found [1].`);
		}
		const connectionInstance = this.connection(replicaData);

		if (!connectionInstance
			|| !(await this.isConnected(connectionInstance, { id: replicaData['id'] }))) {
			throw new NotFoundException(`Replica "${id || name}" not found [2].`);
		}
		const cmdIsPostAction = cmd.includes('.create') || cmd.includes('.send');

		if (cmdIsPostAction
			&& utilsCheckObj(payload)
			&& !utilsCheckStrId(payload['id'])) {
			payload['id'] = uuidv4();
			payload['createdAt'] = (new Date()).toISOString();
		}
		if (cmdIsPostAction
			|| cmd.includes('.update')
			|| cmd.includes('.drop')) {
			connectionInstance.emit(cmd, { ...payload });
		}
		else {
			const connectionInstanceResponse = await lastValueFrom(connectionInstance
				.send({ cmd }, payload)
				.pipe(map(response => response)));

			if (!utilsCheckObj(connectionInstanceResponse)) {
				throw new NotFoundException(`Resource not found.`);
			}
			else if (utilsCheckNumericInt(connectionInstanceResponse['errorCode'])) {
				switch (connectionInstanceResponse['errorCode']) {
					case 404:
						throw new NotFoundException(connectionInstanceResponse['message']);
					case 403:
						throw new WarningException(connectionInstanceResponse['message']);
					default:
						throw new ErrorException(connectionInstanceResponse['message']);
				}
			}
			return connectionInstanceResponse;
		}
		if (utilsCheckObj(payload)) {
			delete payload['accessToken'];
			delete payload['refreshToken'];
		}
		return payload;
	}
}
