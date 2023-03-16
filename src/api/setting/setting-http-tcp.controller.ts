import { Controller } from '@nestjs/common';
import { SettingHttpTcpController as SettingHttpTcpControllerBase } from '@nest-datum/setting';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/setting`)
export class SettingHttpTcpController extends SettingHttpTcpControllerBase {
	protected serviceName = process.env.SERVICE_SSO;

	constructor(
		protected transportService: TransportService,
	) {
		super();
	}
}
