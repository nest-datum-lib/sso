import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ 
			RoleRoleRoleOption,
			RoleOption,
			Role, 
		]),
	],
})
export class RoleRoleOptionModule {
}

