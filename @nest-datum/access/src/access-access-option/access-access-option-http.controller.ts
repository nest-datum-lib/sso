import { BindHttpController } from '@nest-datum/bind';

export class AccessAccessOptionHttpController extends BindHttpController {
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';
}
