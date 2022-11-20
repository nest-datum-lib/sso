import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleOption } from './role-option.entity';
import { RoleOptionService } from './role-option.service';
import { RoleOptionController } from './role-option.controller';

@Module({
	controllers: [ RoleOptionController ],
	imports: [
		TypeOrmModule.forFeature([ RoleOption ]),
		TypeOrmModule.forFeature([ RoleRoleOption ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		RoleOptionService, 
	],
})
export class RoleOptionModule {
}


