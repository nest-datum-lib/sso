import { Entity } from 'typeorm';
import { Setting as BaseSetting } from '@nest-datum/setting';

@Entity()
export class Setting extends BaseSetting {
}
