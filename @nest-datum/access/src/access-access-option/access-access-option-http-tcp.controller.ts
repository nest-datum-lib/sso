import { BindHttpTcpController } from '@nest-datum/bind';

export class AccessAccessOptionHttpTcpController extends BindHttpTcpController {
	protected readonly entityName: string = 'accessOptionRelation';
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';
}
