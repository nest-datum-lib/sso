import { Controller } from '@nestjs/common';
import { StatusHttpTcpController } from '@nest-datum/status';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/user-status`)
export class UserStatusHttpTcpController extends StatusHttpTcpController {
	protected serviceName = process.env.SERVICE_SSO;
	protected readonly entityName: string = 'userStatus';

	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
