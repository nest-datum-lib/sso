import { Controller } from '@nestjs/common';
import { BindHttpController } from '@nest-datum/bind';
import { RoleRoleOptionService } from './role-role-option.service';

@Controller(`${process.env.SERVICE_SSO}/role/option`)
export class RoleRoleOptionHttpController extends BindHttpController {
	constructor(
		protected service: RoleRoleOptionService,
	) {
		super();
	}
}