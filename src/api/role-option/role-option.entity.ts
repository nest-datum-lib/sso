import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { Option } from '@nest-datum/option';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';

@Entity()
export class RoleOption extends Option {
	@OneToMany(() => RoleRoleOption, (roleRoleOption) => roleRoleOption.roleOption, {
		cascade: true,
	})
	public roleRoleOptions: RoleRoleOption[];
}
