import { 
	Entity, 
	Column,
	ManyToOne,
} from 'typeorm';
import { RoleAccess as RoleAccessBase } from '@nest-datum/access';
import { Role } from '../role/role.entity';
import { Access } from '../access/access.entity';

@Entity()
export class RoleAccess extends RoleAccessBase {
	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.roleAccesses, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public access: Access;

	@Column()
	public roleId: string;

	@ManyToOne(() => Role, (role) => role.roleAccesses, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public role: Role;
}
