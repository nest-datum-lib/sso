import { Controller } from '@nestjs/common';
import { AccessOptionTcpController as AccessOptionTcpControllerBase } from '@nest-datum/access';
import { AccessOptionService } from './access-option.service';

@Controller()
export class AccessOptionTcpController extends AccessOptionTcpControllerBase {
	constructor(
		protected service: AccessOptionService,
	) {
		super();
	}
}
