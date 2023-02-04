import getCurrentLine from 'get-current-line';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '../../../transport/src';
import { Controller as NestDatumController } from '../../../../@nest-datum-common/controller/src';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';

@Controller()
export class OptionOptionController extends NestDatumController {
	constructor(
		public transportService,
		public service,
		public columnOptionId,
		public columnOptionOptionId,
	) {
		super(transportService, service);
	}

	validateCreate(options: object = {}): object {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new WarningException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		if (!utilsCheckStrId(options[this.columnOptionId])) {
			throw new WarningException(`Property "${this.columnOptionId}" is not valid.`);
		}
		if (!utilsCheckStrId(options[this.columnOptionOptionId])) {
			throw new WarningException(`Property "${this.columnOptionOptionId}" is not valid.`);
		}

		return {
			userId: user['id'],
			[this.columnOptionId]: options[this.columnOptionId],
			[this.columnOptionOptionId]: options[this.columnOptionOptionId],
		};
	}

	async many(payload) {
		return await super.many(payload);
	}

	async one(payload) {
		return await super.one(payload);
	}

	async drop(payload) {
		return await super.drop(payload);
	}

	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	async create(payload) {
		try {
			const output = await this.service.create(this.validateCreate(payload));

			this.transportService.decrementLoadingIndicator();

			return output;
		}
		catch (err) {
			this.log(err);
			this.transportService.decrementLoadingIndicator();

			return err;
		}
	}
}
