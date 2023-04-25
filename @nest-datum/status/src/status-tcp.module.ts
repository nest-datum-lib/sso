import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { StatusService } from './status.service';
import { StatusTcpController } from './status-tcp.controller';

@Module({
	imports: [],
	controllers: [
		StatusTcpController, 
	],
	providers: [ 
		StatusService,
	],
})
export class StatusTcpModule {
}
