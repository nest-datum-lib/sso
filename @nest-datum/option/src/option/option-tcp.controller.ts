import { Controller } from '@nestjs/common';
import { TcpController as NestDatumTcpController } from '../../../controller/src';
import { 
	strName as utilsCheckStrName,
	strDataType as utilsCheckStrDataType,
	strId as utilsCheckStrId,
	arr as utilsCheckArr,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';

@Controller()
export class OptionTcpController extends NestDatumTcpController {
	protected entityService;

	async validateCreate(options) {
		if (!utilsCheckStrName(options['name'])) {
			throw new this.exceptionConstructor(`Property "name" is not valid.`);
		}
		if (!utilsCheckStrDataType(options['dataTypeId'])) {
			throw new this.exceptionConstructor(`Property "dataTypeId" is not valid.`);
		}
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return {
			...await super.validateUpdate(options),
			defaultValue: String(options['defaultValue'] ?? ''),
		};
	}

	async validateContent(options) {
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
			userId: user['id'],
			id: options['id'],
			data: options['data'],
		};
	}

	async content(payload) {
		return await this.serviceHandlerWrapper(async () => await this.entityService.content(await this.validateContent(payload)));
	}
}
