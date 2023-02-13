import { 
	Controller,
	HttpException, 
} from '@nestjs/common';
import { TcpController } from '../../../controller/src';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';

@Controller()
export class OptionOptionTcpController extends TcpController {
	protected entityId;
	protected entityOptionId;

	async validateCreate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new this.exceptionConstructor(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['entityId'])) {
			throw new this.exceptionConstructor(`Property "entityId" is not valid.`);
		}
		if (!utilsCheckStrId(options['entityOptionId'])) {
			throw new this.exceptionConstructor(`Property "entityOptionId" is not valid.`);
		}

		return {
			userId: user['id'],
			entityId: options['entityId'],
			entityOptionId: options['entityOptionId'],
		};
	}
}
