import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { RoleAccessTcpController as RoleAccessTcpControllerBase } from '@nest-datum/access';
import { RoleAccessService } from './role-access.service';

@Controller()
export class RoleAccessTcpController extends RoleAccessTcpControllerBase {
	constructor(
		protected transportService: TransportService,
		protected entityService: RoleAccessService,
	) {
		super();
	}
}
