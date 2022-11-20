import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessAccessOption } from './access-access-option.entity';
import { AccessOption } from '../access-option/access-option.entity';
import { Access } from '../access/access.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ AccessAccessOption ]),
		TypeOrmModule.forFeature([ AccessOption ]),
		TypeOrmModule.forFeature([ Access ]),
	],
})
export class AccessAccessOptionModule {
}

