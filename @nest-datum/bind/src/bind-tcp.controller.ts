import { TcpController } from '@nest-datum-common/controllers';
import { 
	MethodNotAllowedException,
	UnauthorizedException, 
} from '@nest-datum-common/exceptions';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class BindTcpController extends TcpController {
	protected readonly mainRelationColumnName: string;
	protected readonly optionRelationColumnName: string;

	async validateCreate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options[this.mainRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.mainRelationColumnName}" is not valid.`);
		}
		if (!utilsCheckStrId(options[this.optionRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.optionRelationColumnName}" is not valid.`);
		}

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			[this.mainRelationColumnName]: options[this.mainRelationColumnName],
			[this.optionRelationColumnName]: options[this.optionRelationColumnName],
		};
	}
}
