import { Controller } from '@nestjs/common';
import { AccessAccessOptionHttpController as AccessAccessOptionHttpControllerBase } from '@nest-datum/access';
import { AccessAccessOptionService } from './access-access-option.service';

@Controller(`${process.env.SERVICE_SSO}/access/option`)
export class AccessAccessOptionHttpController extends AccessAccessOptionHttpControllerBase {
	constructor(
		protected service: AccessAccessOptionService,
	) {
		super();
	}
}
