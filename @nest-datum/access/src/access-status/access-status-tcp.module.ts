import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { AccessStatusService } from './access-status.service';
import { AccessStatusTcpController } from './access-status-tcp.controller';

@Module({
	imports: [],
	controllers: [
		AccessStatusTcpController, 
	],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessStatusService,
	],
})
export class AccessStatusTcpModule {
}
