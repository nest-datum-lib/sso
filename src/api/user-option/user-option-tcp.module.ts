import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { UserOptionService } from './user-option.service';
import { UserOptionTcpController } from './user-option-tcp.controller';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { User } from '../user/user.entity';
import { UserOption } from './user-option.entity';

@Module({
	controllers: [
		UserOptionTcpController, 
	],
	imports: [
		TypeOrmModule.forFeature([ 
			UserOption,
			UserUserOption,
			User,
		]),
		CacheModule,
	],
	providers: [ 
		CacheService,
		UserOptionService,
	],
})
export class UserOptionTcpModule {
}
