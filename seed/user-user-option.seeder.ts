import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { UserUserOption } from 'src/api/user-user-option/user-user-option.entity';
export class UserUserOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(UserUserOption) private readonly userUserOptionRepository: Repository<UserUserOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				userId: 'sso-user-admin',
				userOptionId: 'sso-user-option-firstname',
				content: 'Ihor',
			}, {
				userId: 'sso-user-admin',
				userOptionId: 'sso-user-option-lastname',
				content: 'Bielchenko',
			}], async (data) => {
				try {
					await this.userUserOptionRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: user-user-option 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: user-user-option 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}