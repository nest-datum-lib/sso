import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOption } from '../user-option/user-option.entity';
import { User } from '../user/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ UserOption ]),
		TypeOrmModule.forFeature([ User ]),
	],
})
export class UserUserOptionModule {
}

