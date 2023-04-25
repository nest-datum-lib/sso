import { Injectable } from '@nestjs/common';
import { ManyService } from '@nest-datum/many';

@Injectable()
export class AccessAccessAccessOptionService extends ManyService {
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessAccessOptionId';
}
