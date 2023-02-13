import { 
	Entity,
	Column, 
	ManyToOne,
} from 'typeorm';
import { OptionOptionOption } from '@nest-datum/option';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from '../access/access.entity';

@Entity()
export class AccessAccessAccessOption extends OptionOptionOption {
	@Column()
	public accessAccessOptionId: string;

	@ManyToOne(() => AccessAccessOption, (accessAccessOption) => accessAccessOption.accessAccessAccessOptions, {
		onDelete: 'CASCADE'
	})
	public accessAccessOption: AccessAccessOption;

	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.accessAccessAccessOptions)
	public access: Access;
}
