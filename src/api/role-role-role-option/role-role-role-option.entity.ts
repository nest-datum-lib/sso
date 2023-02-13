import { 
	Entity,
	Column, 
	ManyToOne,
} from 'typeorm';
import { OptionOptionOption } from '@nest-datum/option';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from '../role/role.entity';

@Entity()
export class RoleRoleRoleOption extends OptionOptionOption {
	@Column()
	public roleRoleOptionId: string;

	@ManyToOne(() => RoleRoleOption, (roleRoleOption) => roleRoleOption.roleRoleRoleOptions, {
		onDelete: 'CASCADE'
	})
	public roleRoleOption: RoleRoleOption;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleRoleRoleOptions)
	public role: Role;
}
