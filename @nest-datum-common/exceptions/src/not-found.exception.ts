import { Exception } from './exception';

export class NotFoundException extends Exception {
	public readonly cmd: string = 'warning.create';
	public readonly errorCode: number = 404;
}