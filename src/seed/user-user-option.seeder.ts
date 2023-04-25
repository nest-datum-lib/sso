import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserUserOption } from '../api/user-user-option/user-user-option.entity';

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
				userOptionId: 'happ-sso-user-option-firstname',
				userId: process.env.USER_ID,
				content: 'super',
			}, {
				userOptionId: 'happ-sso-user-option-lastname',
				userId: process.env.USER_ID,
				content: 'user',
			}], async (data) => {
				try {
					await this.userUserOptionRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: UserUserOption 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: UserUserOption 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}