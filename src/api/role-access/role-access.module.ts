import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleAccess } from './role-access.entity';
import { Role } from '../role/role.entity';
import { Access } from '../access/access.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ RoleAccess ]),
		TypeOrmModule.forFeature([ Role ]),
		TypeOrmModule.forFeature([ Access ]),
	],
})
export class RoleAccessModule {
}

