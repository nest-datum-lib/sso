import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { AccessOption } from './access-option.entity';
import { AccessOptionService } from './access-option.service';
import { AccessOptionController } from './access-option.controller';

@Module({
	controllers: [ AccessOptionController ],
	imports: [
		TypeOrmModule.forFeature([ AccessOption ]),
		TypeOrmModule.forFeature([ AccessAccessOption ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		AccessOptionService, 
	],
})
export class AccessOptionModule {
}


