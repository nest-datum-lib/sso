import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Role } from '../role/role.entity';
import { RoleStatus } from './role-status.entity';
import { RoleStatusService } from './role-status.service';
import { RoleStatusController } from './role-status.controller';

@Module({
	controllers: [ RoleStatusController ],
	imports: [
		TypeOrmModule.forFeature([ Role ]),
		TypeOrmModule.forFeature([ RoleStatus ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		RoleStatusService, 
	],
})
export class RoleStatusModule {
}
