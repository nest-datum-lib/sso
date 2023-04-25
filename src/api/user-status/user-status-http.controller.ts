import { Controller } from '@nestjs/common';
import { StatusHttpController } from '@nest-datum/status';
import { UserStatusService } from './user-status.service';

@Controller(`${process.env.SERVICE_SSO}/user-status`)
export class UserStatusHttpController extends StatusHttpController {
	constructor(
		protected service: UserStatusService,
	) {
		super();
	}
}
