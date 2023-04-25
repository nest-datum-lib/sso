import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { RoleAccessService } from './role-access.service';
import { RoleAccessTcpController } from './role-access-tcp.controller';

@Module({
	imports: [],
	controllers: [
		RoleAccessTcpController, 
	],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		RoleAccessService,
	],
})
export class RoleAccessTcpModule {
}
