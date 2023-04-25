import { Controller } from '@nestjs/common';
import { StatusHttpController } from '@nest-datum/status';
import { RoleStatusService } from './role-status.service';

@Controller(`${process.env.SERVICE_SSO}/role-status`)
export class RoleStatusHttpController extends StatusHttpController {
	constructor(
		protected service: RoleStatusService,
	) {
		super();
	}
}
