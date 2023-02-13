import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { SettingTcpController } from '@nest-datum/setting';
import { SettingService } from './setting.service';

@Controller()
export class SettingController extends SettingTcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: SettingService,
	) {
		super();
	}
}
