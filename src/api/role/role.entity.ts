import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	OneToMany,
} from 'typeorm';
import {
	IsEmail,
} from 'class-validator';
import { RoleRoleRoleOption } from '../role-role-role-option/role-role-role-option.entity';
import { RoleRoleOption } from '../role-role-option/role-role-option.entity';
import { RoleAccess } from '../role-access/role-access.entity';

@Entity()
export class Role {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	@Index()
	public userId: string;

	@Column({ default: '' })
	public roleStatusId: string;

	@Column({ default: '' })
	public envKey: string;

	@Column()
	@Index({ unique: true })
	public name: string;

	@Column({ default: '' })
	@Index()
	public description: string;

	@Column('boolean', { default: false })
	public isDeleted: boolean = false;

	@Column('boolean', { default: false })
	public isNotDelete: boolean = false;

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

	@OneToMany(() => RoleRoleOption, (roleRoleOption) => roleRoleOption.role, {
		cascade: true,
	})
	public roleRoleOptions: RoleRoleOption[];

	@OneToMany(() => RoleRoleRoleOption, (roleRoleRoleOption) => roleRoleRoleOption.role, {
		cascade: true,
	})
	public roleRoleRoleOptions: RoleRoleRoleOption[];

	@OneToMany(() => RoleAccess, (roleAccess) => roleAccess.role, {
		cascade: true,
	})
	public roleAccesses: RoleAccess[];
}
