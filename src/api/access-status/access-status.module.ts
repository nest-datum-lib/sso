import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Access } from '../access/access.entity';
import { AccessStatus } from './access-status.entity';
import { AccessStatusService } from './access-status.service';
import { AccessStatusController } from './access-status.controller';

@Module({
	controllers: [ AccessStatusController ],
	imports: [
		TypeOrmModule.forFeature([ Access ]),
		TypeOrmModule.forFeature([ AccessStatus ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		AccessStatusService, 
	],
})
export class AccessStatusModule {
}
