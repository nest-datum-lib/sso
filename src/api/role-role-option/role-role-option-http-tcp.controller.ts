import { Controller } from '@nestjs/common';
import { HttpTcpController } from '@nest-datum/controller';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/role/option`)
export class RoleRoleOptionHttpTcpController extends HttpTcpController {
	protected serviceName = process.env.SERVICE_SSO;
	protected entityName = 'roleOptionRelation';

	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
