import { Controller } from '@nestjs/common';
import { AccessStatusHttpTcpController as AccessStatusHttpTcpControllerBase } from '@nest-datum/access';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/access-status`)
export class AccessStatusHttpTcpController extends AccessStatusHttpTcpControllerBase {
	protected serviceName = process.env.SERVICE_SSO;

	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
