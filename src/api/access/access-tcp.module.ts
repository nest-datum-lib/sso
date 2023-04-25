import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { AccessService } from './access.service';
import { AccessTcpController } from './access-tcp.controller';
import { RoleAccess } from '../role-access/role-access.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from './access.entity';

@Module({
	controllers: [ AccessTcpController ],
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
		AccessService, 
	],
})
export class AccessTcpModule {
}

