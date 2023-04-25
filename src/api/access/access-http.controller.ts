import { Controller } from '@nestjs/common';
import { AccessHttpController as AccessHttpControllerBase } from '@nest-datum/access';
import { RoleAccessService } from '../role-access/role-access.service';
import { AccessAccessAccessOptionService } from '../access-access-access-option/access-access-access-option.service';
import { AccessAccessOptionService } from '../access-access-option/access-access-option.service';
import { AccessService } from './access.service';

@Controller(`${process.env.SERVICE_SSO}/access`)
export class AccessHttpController extends AccessHttpControllerBase {
	constructor(
		protected readonly service: AccessService,
		protected readonly serviceOptionContent: AccessAccessAccessOptionService,
		protected readonly serviceOptionRelation: AccessAccessOptionService,
		protected readonly serviceRoleAccess: RoleAccessService,
	) {
		super();
	}
}
