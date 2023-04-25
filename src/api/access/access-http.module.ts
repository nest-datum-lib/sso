import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { AccessService } from './access.service';
import { AccessHttpController } from './access-http.controller';
import { RoleAccessService } from '../role-access/role-access.service';
import { AccessAccessOptionService } from '../access-access-option/access-access-option.service';
import { AccessAccessAccessOptionService } from '../access-access-access-option/access-access-access-option.service';
import { RoleAccess } from '../role-access/role-access.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';

@Module({
	controllers: [ AccessHttpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			AccessOption,
			AccessAccessOption,
			Access,
			AccessAccessAccessOption, 
			RoleAccess,
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		RoleAccessService,
		AccessAccessOptionService,
		AccessAccessAccessOptionService,
		RoleAccess,
		AccessService, 
	],
})
export class AccessHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
