import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { Option } from '@nest-datum/option';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';

@Entity()
export class AccessOption extends Option {
	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.accessOption)
	public accessAccessOptions: AccessAccessOption[];
}
