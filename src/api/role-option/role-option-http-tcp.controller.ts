import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionHttpTcpController } from '@nest-datum/option';

@Controller(`${process.env.SERVICE_SSO}/role-option`)
export class RoleOptionHttpTcpController extends OptionHttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_SSO;
	protected readonly entityName: string = 'roleOption';
	
	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
