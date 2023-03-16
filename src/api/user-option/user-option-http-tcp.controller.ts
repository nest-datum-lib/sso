import { Controller } from '@nestjs/common';
import { OptionHttpTcpController } from '@nest-datum/option';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/user-option`)
export class UserOptionHttpTcpController extends OptionHttpTcpController {
	protected serviceName = process.env.SERVICE_SSO;
	protected entityName = 'userOption';

	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
