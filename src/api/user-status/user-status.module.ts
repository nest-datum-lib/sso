import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { User } from '../user/user.entity';
import { UserStatus } from './user-status.entity';
import { UserStatusService } from './user-status.service';
import { UserStatusController } from './user-status.controller';

@Module({
	controllers: [ UserStatusController ],
	imports: [
		TypeOrmModule.forFeature([ User ]),
		TypeOrmModule.forFeature([ UserStatus ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		UserStatusService, 
	],
})
export class UserStatusModule {
}
