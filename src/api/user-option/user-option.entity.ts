import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { Option } from '@nest-datum/option';
import { UserUserOption } from '../user-user-option/user-user-option.entity';

@Entity()
export class UserOption extends Option {
	@OneToMany(() => UserUserOption, (userUserOption) => userUserOption.userOption)
	public userUserOptions: UserUserOption[];
}
