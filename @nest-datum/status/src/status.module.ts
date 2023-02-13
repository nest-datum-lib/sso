import { Module } from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '../../transport/src';
import {
	CacheModule, 
	CacheService, 
} from '../../cache/src';
import { 
	SqlModule,
	SqlService, 
} from '@nest-datum/sql';
import { StatusService } from './status.service';
import { StatusTcpController } from './status-tcp.controller';
import { StatusHttpController } from './status-http.controller';

@Module({
	controllers: [ 
		StatusTcpController,
		StatusHttpController, 
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
		StatusService, 
	],
})
export class StatusModule {
}
