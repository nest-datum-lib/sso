import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { AccessService } from './access.service';
import { AccessTcpController } from './access-tcp.controller';

@Module({
	imports: [],
	controllers: [
		AccessTcpController, 
	],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		AccessService,
	],
})
export class AccessTcpModule {
}
