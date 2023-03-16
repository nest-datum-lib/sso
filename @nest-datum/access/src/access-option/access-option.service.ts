import { OptionService } from '@nest-datum/option';

export class AccessOptionService extends OptionService {
	protected entityName = 'accessOption';
	protected entityServicedName = 'access';
	protected entityId = 'accessId';
	protected entityOptionId = 'accessOptionId';
	protected entityOptionRelationId = 'accessAccessOptionId';
}
