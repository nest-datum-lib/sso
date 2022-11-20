import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { AccessOption } from 'src/api/access-option/access-option.entity';

export class AccessOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(AccessOption) private readonly accessOptionRepository: Repository<AccessOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([/*{
				id: 'example-option',
				name: 'Example',
				description: 'Example description',
				dataTypeId: 'text',
				isRequired: true,			
			}*/], async (data) => {
				try {
					await this.accessOptionRepository.insert(data);
				}
				catch (err) {
					console.error(`ERROR: access-option 2: ${err.message}`);

					await queryRunner.rollbackTransaction();
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			console.error(`ERROR: access-option 1: ${err.message}`);

			await queryRunner.rollbackTransaction();
		}
		finally {
			await queryRunner.release();
		}
	}
}