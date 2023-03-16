import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { AccessAccessOptionTcpController as AccessAccessOptionTcpControllerBase } from '@nest-datum/access';
import { AccessAccessOptionService } from './access-access-option.service';

@Controller()
export class AccessAccessOptionTcpController extends AccessAccessOptionTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: AccessAccessOptionService,
	) {
		super();
	}
}
