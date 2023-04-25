import { Controller } from '@nestjs/common';
import { OptionHttpController } from '@nest-datum/option';
import { RoleOptionService } from './role-option.service';

@Controller(`${process.env.SERVICE_SSO}/role-option`)
export class RoleOptionHttpController extends OptionHttpController {
	constructor(
		protected service: RoleOptionService,
	) {
		super();
	}
}
