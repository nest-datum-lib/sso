import { Controller } from '@nestjs/common';
import { StatusHttpTcpController } from '@nest-datum/status';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/role-status`)
export class RoleStatusHttpTcpController extends StatusHttpTcpController {
	protected serviceName = process.env.SERVICE_SSO;
	protected entityName = 'roleStatus';

	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
