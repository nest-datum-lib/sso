import { Controller } from '@nestjs/common';
import { AccessOptionHttpController as AccessOptionHttpControllerBase } from '@nest-datum/access';
import { AccessOptionService } from './access-option.service';

@Controller(`${process.env.SERVICE_SSO}/access-option`)
export class AccessOptionHttpController extends AccessOptionHttpControllerBase {
	constructor(
		protected service: AccessOptionService,
	) {
		super();
	}
}
