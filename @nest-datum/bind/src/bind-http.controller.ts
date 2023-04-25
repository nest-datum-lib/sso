import { 
	UnauthorizedException,
	MethodNotAllowedException
} from '@nestjs/common';
import { HttpController } from '@nest-datum-common/controllers';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class BindHttpController extends HttpController {
	async validateCreate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options['entityId'])) {
			throw new MethodNotAllowedException(`Property "entityId" is not valid.`);
		}
		if (!utilsCheckStrId(options['entityOptionId'])) {
			throw new MethodNotAllowedException(`Property "entityOptionId" is not valid.`);
		}

		return {
			userId: user['id'],
			entityId: options['entityId'],
			entityOptionId: options['entityOptionId'],
		};
	}
}
