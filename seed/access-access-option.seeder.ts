import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { AccessAccessOption } from 'src/api/access-access-option/access-access-option.entity';

export class AccessAccessOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(AccessAccessOption) private readonly accessAccessOptionRepository: Repository<AccessAccessOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([/*{
				accessId: 'example',
				accessOptionId: 'example-option',
			}*/], async (data) => {
				try {
					await this.accessAccessOptionRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: access-access-option 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: access-access-option 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}