import { Controller } from '@nestjs/common';
import { BindHttpTcpController } from '@nest-datum/bind';
import { TransportService } from '@nest-datum/transport';

@Controller(`${process.env.SERVICE_SSO}/role/option`)
export class RoleRoleOptionHttpTcpController extends BindHttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_SSO;
	protected readonly entityName: string = 'roleOptionRelation';
	protected readonly mainRelationColumnName: string = 'roleId';
	protected readonly optionRelationColumnName: string = 'roleOptionId';

	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
