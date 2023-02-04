import { Entity } from 'typeorm';
import { Setting as NestDatumSetting } from '@nest-datum/setting';

@Entity()
export class Setting extends NestDatumSetting {
}
