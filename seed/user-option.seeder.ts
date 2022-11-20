import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { UserOption } from 'src/api/user-option/user-option.entity';

export class UserOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(UserOption) private readonly userOptionRepository: Repository<UserOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'user-option-firstname',
				name: 'Firstname',
				description: 'User firstname.',
				dataTypeId: 'text',
				isRequired: true,			
			}, {
				id: 'user-option-lastname',
				name: 'Lastname',
				description: 'User lastname.',
				dataTypeId: 'text',
				isRequired: true,			
			}], async (data) => {
				try {
					await this.userOptionRepository.insert(data);
				}
				catch (err) {
					console.error(`ERROR: user-option 2: ${err.message}`);

					await queryRunner.rollbackTransaction();
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			console.error(`ERROR: user-option 1: ${err.message}`);

			await queryRunner.rollbackTransaction();
		}
		finally {
			await queryRunner.release();
		}
	}
}