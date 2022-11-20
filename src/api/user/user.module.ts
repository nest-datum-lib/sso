import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { UserStatus } from '../user-status/user-status.entity';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
	controllers: [ UserController ],
	imports: [
		TypeOrmModule.forFeature([ User ]),
		TypeOrmModule.forFeature([ UserStatus ]),
		TypeOrmModule.forFeature([ UserUserOption ]),
		TypeOrmModule.forFeature([ User ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		UserService, 
	],
})
export class UserModule {
}

