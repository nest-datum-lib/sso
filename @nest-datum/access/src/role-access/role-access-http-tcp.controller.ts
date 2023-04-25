import { HttpTcpController } from '@nest-datum-common/controllers';

export class RoleAccessHttpTcpController extends HttpTcpController {
	protected readonly entityName: string = 'roleAccess';
}
