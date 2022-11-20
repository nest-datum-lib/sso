import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Role } from '../role/role.entity';
import { RoleAccess } from '../role-access/role-access.entity';
import { AccessStatus } from '../access-status/access-status.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';

@Module({
	controllers: [ AccessController ],
	imports: [
		TypeOrmModule.forFeature([ Role ]),
		TypeOrmModule.forFeature([ RoleAccess ]),
		TypeOrmModule.forFeature([ AccessStatus ]),
		TypeOrmModule.forFeature([ AccessAccessAccessOption ]),
		TypeOrmModule.forFeature([ AccessAccessOption ]),
		TypeOrmModule.forFeature([ Access ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		AccessService, 
	],
})
export class AccessModule {
}

