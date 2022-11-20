import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { Access } from '../access/access.entity';

@Entity()
export class AccessAccessOption {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column()
	public accessOptionId: string;

	@ManyToOne(() => AccessOption, (accessOption) => accessOption.accessAccessOptions)
	public accessOption: AccessOption;

	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.accessAccessOptions)
	public access: Access;

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

	@OneToMany(() => AccessAccessAccessOption, (accessAccessAccessOption) => accessAccessAccessOption.accessAccessOption)
	public accessAccessAccessOptions: AccessAccessAccessOption[];
}
