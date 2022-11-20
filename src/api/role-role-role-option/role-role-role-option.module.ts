import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from '../role/role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ RoleRoleOption ]),
		TypeOrmModule.forFeature([ Role ]),
	],
})
export class RoleRoleRoleOptionModule {
}

