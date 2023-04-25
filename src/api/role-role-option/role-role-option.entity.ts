import { 
	Entity,
	Column, 
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Bind } from '@nest-datum/bind';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';

@Entity()
export class RoleRoleOption extends Bind {
	@Column()
	public roleOptionId: string;

	@ManyToOne(() => RoleOption, (roleOption) => roleOption.roleRoleOptions)
	public roleOption: RoleOption;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleRoleOptions)
	public role: Role;

	@OneToMany(() => RoleRoleRoleOption, (roleRoleRoleOption) => roleRoleRoleOption.roleRoleOption)
	public roleRoleRoleOptions: RoleRoleRoleOption[];
}
