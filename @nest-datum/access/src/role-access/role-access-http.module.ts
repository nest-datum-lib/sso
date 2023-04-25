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
import { RoleAccessHttpController } from './role-access-http.controller';

@Module({
	imports: [],
	controllers: [ RoleAccessHttpController ],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService,
		FuseService, 
		RoleAccessService,
	],
})
export class RoleAccessHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
