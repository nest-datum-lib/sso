import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { UserOption } from '../user-option/user-option.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserUserOption {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public parentId: string;

	@Column()
	public userOptionId: string;

	@ManyToOne(() => UserOption, (userOption) => userOption.userUserOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public userOption: UserOption;

	@Column()
	public userId: string;

	@ManyToOne(() => User, (user) => user.userUserOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public user: User;

	@Column('text')
	public content: string;

	@Column('boolean', { default: false })
	public isDeleted: boolean = false;

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
