import { Exception } from './exception';

export class WarningException extends Exception {
	public readonly cmd: string = 'warning.create';
	public readonly errorCode: number = 403;
}