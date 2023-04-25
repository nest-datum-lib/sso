import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { OptionHttpTcpController } from '@nest-datum/option';

@Controller(`${process.env.SERVICE_SSO}/user-option`)
export class UserOptionHttpTcpController extends OptionHttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_SSO;
	protected readonly entityName: string = 'userOption';
	
	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
