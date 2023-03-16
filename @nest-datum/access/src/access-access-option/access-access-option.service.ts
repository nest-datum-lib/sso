import { Injectable } from '@nestjs/common';
import { OptionOptionService } from '@nest-datum/option';

export class AccessAccessOptionService extends OptionOptionService {
	protected entityName = 'accessAccessOption';
	protected entityOptionId = 'accessOptionId';
	protected entityId = 'accessId';
}
