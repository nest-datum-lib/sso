import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { AccessHttpTcpController as AccessHttpTcpControllerBase } from '@nest-datum/access';

@Controller(`${process.env.SERVICE_SSO}/access`)
export class AccessHttpTcpController extends AccessHttpTcpControllerBase {
	protected serviceName = process.env.SERVICE_SSO;
	
	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
