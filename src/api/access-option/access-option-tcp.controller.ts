import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { AccessOptionTcpController as AccessOptionTcpControllerBase } from '@nest-datum/access';
import { AccessOptionService } from './access-option.service';

@Controller()
export class AccessOptionTcpController extends AccessOptionTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: AccessOptionService,
	) {
		super();
	}
}
