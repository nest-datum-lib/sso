import { OptionService } from '@nest-datum/option';

export class AccessOptionService extends OptionService {
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';
	protected readonly optionContentColumnName: string = 'accessAccessOptionId';
}
