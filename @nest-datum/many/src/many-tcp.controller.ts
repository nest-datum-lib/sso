import { TcpController } from '@nest-datum-common/controllers';
import { 
	MethodNotAllowedException,
	UnauthorizedException, 
} from '@nest-datum-common/exceptions';
import { strToArr as utilsFormatStrToArr } from '@nest-datum-utils/format';
import { 
	strId as utilsCheckStrId,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';

export class ManyTcpController extends TcpController {
	protected readonly service;

	async validateContent(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`)
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}
		options['data'] = utilsFormatStrToArr(options['data']);

		if (!utilsCheckArr(options['data'])) {
			throw new MethodNotAllowedException(`Property "data" is not valid.`);
		}
		return {
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	async validateUpdateContent(options) : Promise<any> {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is nt valid.`);
		}
		
		return {
			id: options['id'],
			content: String(options['content'] ?? ''),
		};
	}

	async content(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.content(await this.validateContent(payload)));
	}

	async updateContent(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.updateContent(await this.validateUpdateContent(payload)));
	}
}
