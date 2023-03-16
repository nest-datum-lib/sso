import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { SettingTcpController as SettingTcpControllerBase } from '@nest-datum/setting';
import { SettingService } from './setting.service';

@Controller()
export class SettingTcpController extends SettingTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: SettingService,
	) {
		super();
	}
}
