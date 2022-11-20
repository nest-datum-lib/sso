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
import { AccessStatus } from '../access-status/access-status.entity';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';

@Entity()
export class Access {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column({ default: '' })
	public accessStatusId: string;

	@ManyToOne(() => AccessStatus, (accessStatus) => accessStatus.accesses)
	public accessStatus: AccessStatus;

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

	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.access)
	public accessAccessOptions: AccessAccessOption[];

	@OneToMany(() => AccessAccessAccessOption, (accessAccessAccessOption) => accessAccessAccessOption.access)
	public accessAccessAccessOptions: AccessAccessAccessOption[];

	@OneToMany(() => RoleAccess, (roleAccess) => roleAccess.access)
	public roleAccesses: RoleAccess[];
}
