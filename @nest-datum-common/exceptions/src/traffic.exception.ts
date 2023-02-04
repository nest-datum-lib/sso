import { Exception } from './exception';

export class TrafficException extends Exception {
	public readonly cmd: string = 'traffic.create';
	public readonly errorCode: number = 200;

	public data({ host = process.env.APP_HOST, port = process.env.APP_PORT }: { host?: string; port?: string }): any {
		return {
			projectId: process.env.PROJECT_ID,
			appId: process.env.APP_ID,
			host,
			port,
			method: 'example',
			route: 'example',
			ip: '0.0.0.0',
		};
	}
}