import { Controller as NestjsController } from '@nestjs/common';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import {
	strId as utilsCheckStrId,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { TcpController } from './tcp-controller';

@NestjsController()
export class TcpOptionController extends TcpController {
	protected transportService;
	protected entityService;

	async validateOptions(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new this.exceptionConstructor(`Property "id" is nt valid.`);
		}
		try {
			options['data'] = JSON.parse(options['data']);
		}
		catch (err) {
		}
		if (!utilsCheckArr(options['data'])) {
			throw new this.exceptionConstructor(`Property "data" is nt valid.`);
		}

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	async createOptions(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.createOptions(await this.validateOptions(payload)));
	}
}
