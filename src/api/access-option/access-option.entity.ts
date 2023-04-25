import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { AccessOption as AccessOptionBase } from '@nest-datum/access';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';

@Entity()
export class AccessOption extends AccessOptionBase {
	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.accessOption)
	public accessAccessOptions: AccessAccessOption[];
}
