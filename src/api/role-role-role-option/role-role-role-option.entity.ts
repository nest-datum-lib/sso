import { 
	Entity,
	Column, 
	ManyToOne,
} from 'typeorm';
import { Many } from '@nest-datum/many';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from '../role/role.entity';

@Entity()
export class RoleRoleRoleOption extends Many {
	@Column()
	public roleRoleOptionId: string;

	@ManyToOne(() => RoleRoleOption, (roleRoleOption) => roleRoleOption.roleRoleRoleOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public roleRoleOption: RoleRoleOption;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleRoleRoleOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public role: Role;
}
