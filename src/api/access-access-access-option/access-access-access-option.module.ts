import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessAccessAccessOption } from './access-access-access-option.entity';
import { AccessAccessOption } from '../access-access-option/access-access-option.entity';
import { Access } from '../access/access.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ AccessAccessAccessOption ]),
		TypeOrmModule.forFeature([ AccessAccessOption ]),
		TypeOrmModule.forFeature([ Access ]),
	],
})
export class AccessAccessAccessOptionModule {
}

