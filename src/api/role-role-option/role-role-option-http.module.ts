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
import { RoleRoleOptionService } from './role-role-option.service';
import { RoleRoleOptionHttpController } from './role-role-option-http.controller';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';
import { RoleRoleOption } from './role-role-option.entity';

@Module({
	controllers: [ RoleRoleOptionHttpController ],
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
	],
})
export class RoleRoleOptionHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
