import { 
	Entity,
	Column, 
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { AccessAccessOption as AccessAccessOptionBase } from '@nest-datum/access';
import { AccessAccessAccessOption } from '../access-access-access-option/access-access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { Access } from '../access/access.entity';

@Entity()
export class AccessAccessOption extends AccessAccessOptionBase {
	@Column()
	public accessOptionId: string;

	@ManyToOne(() => AccessOption, (accessOption) => accessOption.accessAccessOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public accessOption: AccessOption;

	@Column()
	public accessId: string;

	@ManyToOne(() => Access, (access) => access.accessAccessOptions, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public access: Access;

	@OneToMany(() => AccessAccessAccessOption, (accessAccessAccessOption) => accessAccessAccessOption.accessAccessOption, {
		cascade: true,
	})
	public accessAccessAccessOptions: AccessAccessAccessOption[];
}
