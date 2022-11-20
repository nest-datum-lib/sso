import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserOption } from './user-option.entity';
import { UserOptionService } from './user-option.service';
import { UserOptionController } from './user-option.controller';

@Module({
	controllers: [ UserOptionController ],
	imports: [
		TypeOrmModule.forFeature([ UserOption ]),
		TypeOrmModule.forFeature([ UserUserOption ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		UserOptionService, 
	],
})
export class UserOptionModule {
}


