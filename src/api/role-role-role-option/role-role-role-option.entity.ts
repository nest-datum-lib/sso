import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { Role } from '../role/role.entity';

@Entity()
export class RoleRoleRoleOption {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public parentId: string;

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

	@Column('text')
	public content: string;

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
}
