import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { Access as BaseAccess } from '@nest-datum/access';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { RoleAccess } from '../role-access/role-access.entity';

@Entity()
export class Access extends BaseAccess {
	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.access)
	public accessAccessOptions: AccessAccessOption[];

	@OneToMany(() => AccessAccessAccessOption, (accessAccessAccessOption) => accessAccessAccessOption.access)
	public accessAccessAccessOptions: AccessAccessAccessOption[];

	@OneToMany(() => RoleAccess, (roleAccess) => roleAccess.access)
	public roleAccesses: RoleAccess[];
}
