import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { AccessOptionService } from './access-option.service';
import { AccessOptionTcpController } from './access-option-tcp.controller';

@Module({
	imports: [],
	controllers: [
		AccessOptionTcpController, 
	],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessOptionService,
	],
})
export class AccessOptionTcpModule {
}
