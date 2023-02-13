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
import { OptionService } from './option.service';
import { OptionTcpController } from './option-tcp.controller';
import { OptionHttpController } from './option-http.controller';

@Module({
	controllers: [ 
		OptionTcpController,
		OptionHttpController, 
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
		OptionService, 
	],
})
export class OptionModule {
}
