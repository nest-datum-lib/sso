import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { AccessTcpController as AccessTcpControllerBase } from '@nest-datum/access';
import { AccessService } from './access.service';

@Controller()
export class AccessTcpController extends AccessTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: AccessService,
	) {
		super();
	}
}
