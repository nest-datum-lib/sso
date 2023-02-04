import { Module } from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '../../../transport/src';
import {
	CacheModule, 
	CacheService, 
} from '../../../cache/src';
import { 
	SqlModule,
	SqlService, 
} from '@nest-datum/sql';
import { OptionOptionService } from './option-option.service';
import { OptionOptionController } from './option-option.controller';

@Module({
	controllers: [ OptionOptionController ],
	imports: [
		SqlModule,
		TransportModule,
		CacheModule,
	],
	providers: [
		TransportService,
		SqlService,
		CacheService,
		OptionOptionService, 
	],
})
export class OptionOptionModule {
}
