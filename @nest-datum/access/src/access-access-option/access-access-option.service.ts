import { Injectable } from '@nestjs/common';
import { BindService } from '@nest-datum/bind';

export class AccessAccessOptionService extends BindService {
	protected readonly mainRelationColumnName: string = 'accessId';
	protected readonly optionRelationColumnName: string = 'accessOptionId';
}
