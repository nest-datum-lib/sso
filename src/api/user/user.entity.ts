import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import {
	IsEmail,
} from 'class-validator';
import { UserUserOption } from '../user-user-option/user-user-option.entity';
import { UserStatus } from '../user-status/user-status.entity';
import { Role } from '../role/role.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.users)
	public role: Role;

	@Column({ default: '' })
	public userStatusId: string;

	@ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
	public userStatus: UserStatus;

	@Column({ unique: true })
	@IsEmail()
	public email: string;

	@Column({ unique: true })
	@Column()
	public login: string;

	@Column()
	public password: string;

	@Column()
	public emailVerifyKey: string;

	@Column({ 
		type: 'timestamp', 
		precision: null,
		nullable: true,
		default: () => null 
	})
	public emailVerifiedAt: Date;

	@Column('boolean', { default: false })
	public isNotDelete: boolean;

	@Column('boolean', { default: false })
	public isDeleted: boolean;

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

	@OneToMany(() => UserUserOption, (userUserOption) => userUserOption.user)
	public userUserOptions: UserUserOption[];
}
