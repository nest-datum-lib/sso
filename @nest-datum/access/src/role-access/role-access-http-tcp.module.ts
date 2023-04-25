import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from '@nest-datum/primary';
import { FuseService } from '@nest-datum/fuse';
import { RoleAccessService } from './role-access.service';
import { RoleAccessHttpTcpController } from './role-access-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ RoleAccessHttpTcpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		RoleAccessService,
	],
})
export class RoleAccessHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
