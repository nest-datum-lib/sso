import { Controller } from '@nestjs/common';
import { AccessTcpController as AccessTcpControllerBase } from '@nest-datum/access';
import { AccessService } from './access.service';

@Controller()
export class AccessTcpController extends AccessTcpControllerBase {
	constructor(
		protected service: AccessService,
	) {
		super();
	}
}
