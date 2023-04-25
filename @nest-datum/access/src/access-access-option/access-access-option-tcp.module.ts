import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { AccessAccessOptionService } from './access-access-option.service';
import { AccessAccessOptionTcpController } from './access-access-option-tcp.controller';

@Module({
	imports: [],
	controllers: [
		AccessAccessOptionTcpController, 
	],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessAccessOptionService,
	],
})
export class AccessAccessOptionTcpModule {
}
