import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { RoleAccess } from '../role-access/role-access.entity';
import { RoleStatus } from '../role-status/role-status.entity';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { User } from '../user/user.entity';

@Entity()
export class Role {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column({ default: '' })
	public roleStatusId: string;

	@ManyToOne(() => RoleStatus, (roleStatus) => roleStatus.roles)
	public roleStatus: RoleStatus;

	@Column()
	public name: string;

	@Column({ default: '' })
	public description: string;

	@Column('boolean', { default: false })
	public isDeleted: boolean = false;

	@Column('boolean', { default: false })
	public isNotDelete: boolean;

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

	@OneToMany(() => RoleRoleOption, (roleRoleOption) => roleRoleOption.role)
	public roleRoleOptions: RoleRoleOption[];

	@OneToMany(() => RoleRoleRoleOption, (roleRoleRoleOption) => roleRoleRoleOption.role)
	public roleRoleRoleOptions: RoleRoleRoleOption[];

	@OneToMany(() => User, (user) => user.role)
	public users: User[];

	@OneToMany(() => RoleAccess, (roleAccess) => roleAccess.role)
	public roleAccesses: RoleAccess[];
}
