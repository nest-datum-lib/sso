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
import { StatusController } from './status.controller';

@Module({
	controllers: [ StatusController ],
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
