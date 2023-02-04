import { Exception } from './exception';

export class NotificationException extends Exception {
	public readonly cmd: string = 'notification.create';
	public readonly errorCode: number = 200;

	public options(action?: string): any {
		return {
			action: action || this.getMessage(),
			content: this.getMessage(),
		};
	}
}