import { Controller } from '@nestjs/common';
import { SettingTcpController as SettingTcpControllerBase } from '@nest-datum/setting';
import { SettingService } from './setting.service';

@Controller()
export class SettingTcpController extends SettingTcpControllerBase {
	constructor(
		protected service: SettingService,
	) {
		super();
	}
}
