import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
} from 'typeorm';
import {
	IsEmail,
} from 'class-validator';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	@Index()
	public roleId: string;

	@Column({ default: '' })
	@Index()
	public userStatusId: string;

	@Column({ unique: true })
	@IsEmail()
	@Index({ unique: true })
	public email: string;

	@Column({ unique: true })
	@Index({ unique: true })
	public login: string;

	@Column()
	public password: string;

	@Column()
	@Index()
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
}
