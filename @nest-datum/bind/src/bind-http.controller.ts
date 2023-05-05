import { 
	Delete,
	Post,
	Patch,
	Body,
	Param,
} from '@nestjs/common';
import { 
	UnauthorizedException,
	MethodNotAllowedException
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpController } from '@nest-datum-common/controllers';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class BindHttpController extends HttpController {
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

	@Post(':id')
	async create(
		@AccessToken() accessToken: string,
		@Param('id') entityId: string,
		@Body() data,
	) {
		const dataKeys = Object.keys(data);
		const entityRelationId = data[dataKeys[0]];

		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate({
			accessToken,
			[this.mainRelationColumnName]: entityId,
			[this.optionRelationColumnName]: entityRelationId,
		})));
	}
}
