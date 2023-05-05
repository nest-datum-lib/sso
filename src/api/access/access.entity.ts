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
	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.access, {
		cascade: true,
	})
	public accessAccessOptions: AccessAccessOption[];

	@OneToMany(() => AccessAccessAccessOption, (accessAccessAccessOption) => accessAccessAccessOption.access, {
		cascade: true,
	})
	public accessAccessAccessOptions: AccessAccessAccessOption[];

	@OneToMany(() => RoleAccess, (roleAccess) => roleAccess.access, {
		cascade: true,
	})
	public roleAccesses: RoleAccess[];
}
