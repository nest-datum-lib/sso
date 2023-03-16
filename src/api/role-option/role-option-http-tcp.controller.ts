import { Controller } from '@nestjs/common';
import { OptionHttpTcpController } from '@nest-datum/option';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/role-option`)
export class RoleOptionHttpTcpController extends OptionHttpTcpController {
	protected serviceName = process.env.SERVICE_SSO;
	protected entityName = 'roleOption';

	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
