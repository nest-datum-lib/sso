import { 
	Entity,
	OneToMany, 
} from 'typeorm';
import { Option as NestDatumOption } from '@nest-datum/option';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';

@Entity()
export class AccessOption extends NestDatumOption {
	@OneToMany(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.accessOption)
	public accessAccessOptions: AccessAccessOption[];
}
