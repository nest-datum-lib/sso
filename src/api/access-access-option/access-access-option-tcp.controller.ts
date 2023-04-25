import { Controller } from '@nestjs/common';
import { AccessAccessOptionTcpController as AccessAccessOptionTcpControllerBase } from '@nest-datum/access';
import { AccessAccessOptionService } from './access-access-option.service';

@Controller()
export class AccessAccessOptionTcpController extends AccessAccessOptionTcpControllerBase {
	constructor(
		protected service: AccessAccessOptionService,
	) {
		super();
	}
}
