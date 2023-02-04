import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { SettingController as NestDatumSettingController } from '@nest-datum/setting';
import { SettingService } from './setting.service';

@Controller()
export class SettingController extends NestDatumSettingController {
	constructor(
		public transportService: TransportService,
		public service: SettingService,
	) {
		super(transportService, service);
	}
}
