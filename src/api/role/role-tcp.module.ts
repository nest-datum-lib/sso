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
import { RoleTcpController } from './role-tcp.controller';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from './role.entity';

@Module({
	controllers: [ RoleTcpController ],
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
		RoleService,
	],
})
export class RoleTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
