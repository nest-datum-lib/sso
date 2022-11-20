import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { RoleOption } from 'src/api/role-option/role-option.entity';

export class RoleOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(RoleOption) private readonly roleOptionRepository: Repository<RoleOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([/*{
				id: 'example',
				name: 'Example',
				description: 'example',
				dataTypeId: 'text',
				isRequired: true,			
			}*/], async (data) => {
				try {
					await this.roleOptionRepository.insert(data);
				}
				catch (err) {
					console.error(`ERROR: role-option 2: ${err.message}`);

					await queryRunner.rollbackTransaction();
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			console.error(`ERROR: role-option 1: ${err.message}`);

			await queryRunner.rollbackTransaction();
		}
		finally {
			await queryRunner.release();
		}
	}
}