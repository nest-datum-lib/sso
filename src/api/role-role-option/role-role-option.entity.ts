import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleOption } from '../role-option/role-option.entity';
import { Role } from '../role/role.entity';

@Entity()
export class RoleRoleOption {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column()
	public roleOptionId: string;

	@ManyToOne(() => RoleOption, (roleOption) => roleOption.roleRoleOptions)
	public roleOption: RoleOption;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleRoleOptions)
	public role: Role;

	@CreateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP', 
	})
	public createdAt: Date;

	@UpdateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP', 
	})
	public updatedAt: Date;

	@OneToMany(() => RoleRoleRoleOption, (roleRoleRoleOption) => roleRoleRoleOption.roleRoleOption)
	public roleRoleRoleOptions: RoleRoleRoleOption[];
}
