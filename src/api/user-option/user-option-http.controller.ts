import { Controller } from '@nestjs/common';
import { OptionHttpController } from '@nest-datum/option';
import { UserOptionService } from './user-option.service';

@Controller(`${process.env.SERVICE_SSO}/user-option`)
export class UserOptionHttpController extends OptionHttpController {
	constructor(
		protected service: UserOptionService,
	) {
		super();
	}
}
