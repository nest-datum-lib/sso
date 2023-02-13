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
import { OptionOptionTcpController } from './option-option-tcp.controller';
import { OptionOptionHttpController } from './option-option-http.controller';

@Module({
	controllers: [ 
		OptionOptionTcpController, 
		OptionOptionHttpController,
	],
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
