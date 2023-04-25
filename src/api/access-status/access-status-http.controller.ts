import { Controller } from '@nestjs/common';
import { AccessStatusHttpController as AccessStatusHttpControllerBase } from '@nest-datum/access';
import { AccessStatusService } from './access-status.service';

@Controller(`${process.env.SERVICE_SSO}/access-status`)
export class AccessStatusHttpController extends AccessStatusHttpControllerBase {
	constructor(
		protected service: AccessStatusService,
	) {
		super();
	}
}
