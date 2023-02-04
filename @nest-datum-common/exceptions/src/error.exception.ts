import { Exception } from './exception';

export class ErrorException extends Exception {
	public readonly cmd: string = 'err.create';
}