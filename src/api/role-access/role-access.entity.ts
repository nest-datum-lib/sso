import { 
	Entity, 
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Access } from '../access/access.entity';

@Entity()
export class RoleAccess {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleAccesses)
	public role: Role;

	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.roleAccesses)
	public access: Access;

	@CreateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP', 
	})
	public createdAt: Date;
}
