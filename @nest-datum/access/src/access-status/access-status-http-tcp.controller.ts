import { StatusHttpTcpController } from '@nest-datum/status';

export class AccessStatusHttpTcpController extends StatusHttpTcpController {
	protected entityName = 'accessStatus';
}
