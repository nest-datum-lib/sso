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
import { RoleService } from './role.service';
import { RoleHttpController } from './role-http.controller';
import { RoleRoleOptionService } from '../role-role-option/role-role-option.service';
import { RoleRoleRoleOptionService } from '../role-role-role-option/role-role-role-option.service';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from './role.entity';

@Module({
	controllers: [ RoleHttpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			RoleOption,
			RoleRoleOption,
			Role,
			RoleRoleRoleOption, 
		]),
		CacheModule,
	],
	providers: [ 
		CacheService,
		RoleRoleOptionService,
		RoleRoleRoleOptionService,
		RoleService,
	],
})
export class RoleHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
