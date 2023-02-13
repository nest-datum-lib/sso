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
	exists as utilsCheckExists,
	obj as utilsCheckObj,
	strId as utilsCheckStrId,
	strHost as utilsCheckStrHost,
	strName as utilsCheckStrName,
	strQueue as utilsCheckStrQueue,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';

const SEND_NOT_FOUND_BALANCER = '[1]';
const SEND_NOT_FOUND_DATA = '[2]';
const SEND_NOT_FOUND_CONN = '[3]';

const _savedInstance = {};

@Injectable()
export class TransportService extends RedisService {
	constructor(
		@InjectRedis(process['REDIS_TRANSPORT']) public redisService: Redis,
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
					host: host || this.replicaService.setting('app_host'),
					port: Number(port || this.replicaService.setting('app_port')),
				},
			});
			_savedInstance[id] = connectionInstance;

			connectionInstance.connect();
		}
		return connectionInstance;
	}

	async isConnected(connectionInstance, id: string): Promise<boolean> {
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
						else if (index >= Number(this.replicaService.setting('transport_connect_attempts') || 3)) {
							clearInterval(interval);
							reject(new Error(`Service "${id}" is unavailable.`));
							return;
						}
						index += 1;
					}, Number(this.replicaService.setting('transport_connect_attempts_timeout') || 200));
				}));
			}
			return true;
		}
		catch (err) {
			delete _savedInstance[id];
		}
		return false;
	}

	async lessLoadedConnection(appName: string): Promise<any> {
		const redisValue = await this.redisService.lindex(this.replicaService.prefix(`${appName}|balancer`), 0);

		if (!utilsCheckStrQueue(redisValue)) {
			throw new NotFoundException(`Replica ${appName} is undefined.`, SEND_NOT_FOUND_BALANCER);
		}
		const redisValueSplit = redisValue.split('|');

		return {
			id: redisValueSplit[0],
			name: appName,
			host: redisValueSplit[1],
			port: redisValueSplit[2],
		};
	}

	async balance(): Promise<any> {
		const appName = this.replicaService.setting('app_name');
		const appId = this.replicaService.setting('app_id');
		const appHost = this.replicaService.setting('app_host');
		const appPort = this.replicaService.setting('app_port');

		try {
			await this.redisService.lrem(this.replicaService.prefix(`${appName}|balancer`), 0, `${appId}|${appHost}|${appPort}`);
		}
		catch (err) {
		}
		await this.redisService.rpush(this.replicaService.prefix(`${appName}|balancer`), `${appId}|${appHost}|${appPort}`);

		return appId;
	}

	async get(appId: string): Promise<any> {
		return {
			id: appId,
			name: await this.redisService.get(this.replicaService.prefix(`${appId}|app_name`)),
			host: await this.redisService.get(this.replicaService.prefix(`${appId}|app_host`)),
			port: await this.redisService.get(this.replicaService.prefix(`${appId}|app_port`)),
		};
	}

	async create(): Promise<boolean> {
		const appId = this.replicaService.setting('app_id');
		const appHost = this.replicaService.setting('app_host')
		const appPort = this.replicaService.setting('app_port');

		if (!utilsCheckStrHost(appHost)) {
			throw new Error('Replica host is undefiined.');
		}
		if (!utilsCheckNumericInt(appPort)) {
			throw new Error('Replica port is undefiined.');
		}
		await this.createSettingsInRedis();
		await this.balance();
		await this.sendLog(new NotificationException(`Replica "${appId} - ${appHost}:${appPort}" successfully created!`));

		return true;
	}

	async createSettingsInRedis(): Promise<any> {
		const settings = this.replicaService.settings();
		const appId = settings['app_id'];
		const appName = settings['app_name'];
		let key;

		for (key in settings) {
			await this.redisService.set(this.replicaService.prefix(`${appName}|${appId}|${key}`), settings[key]);
			await this.redisService.set(this.replicaService.prefix(`${appId}|${key}`), settings[key]);
		}
		return settings;
	}

	async send({ name, id, cmd }: { name?: string, id?: string; cmd: string }, payload: any): Promise<any> {
		const replicaData = utilsCheckStrId(id)
			? await this.get(id)
			: await this.lessLoadedConnection(name);

		if (!replicaData) {
			throw new NotFoundException(`Replica "${id || name}" not found.`, SEND_NOT_FOUND_DATA);
		}
		const connectionInstance = this.connection(replicaData);

		if (!connectionInstance
			|| !(await this.isConnected(connectionInstance, replicaData['id']))) {
			throw new NotFoundException(`Replica "${id || name}" not found.`, SEND_NOT_FOUND_CONN);
		}
		const cmdIsPostAction = cmd.includes('.create') 
			|| cmd.includes('.send')
			|| cmd.includes('.content');

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

			if (!utilsCheckExists(connectionInstanceResponse)) {
				throw new NotFoundException(`Resource not found.`);
			}
			else if (utilsCheckObj(connectionInstanceResponse) 
				&& utilsCheckNumericInt(connectionInstanceResponse['errorCode'])) {
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
}
