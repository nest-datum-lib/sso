import { Controller } from '@nestjs/common';
import { RoleAccessTcpController as RoleAccessTcpControllerBase } from '@nest-datum/access';
import { RoleAccessService } from './role-access.service';

@Controller()
export class RoleAccessTcpController extends RoleAccessTcpControllerBase {
	constructor(
		protected service: RoleAccessService,
	) {
		super();
	}
}
