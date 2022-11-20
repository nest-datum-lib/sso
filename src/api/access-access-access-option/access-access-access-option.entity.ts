import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from '../access/access.entity';

@Entity()
export class AccessAccessAccessOption {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public parentId: string;

	@Column()
	public accessAccessOptionId: string;

	@ManyToOne(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.accessAccessAccessOptions, {
		onDelete: 'CASCADE'
	})
	public accessAccessOption: AccessAccessOption;

	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.accessAccessAccessOptions)
	public access: Access;

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
