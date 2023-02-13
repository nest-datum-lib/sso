import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserUserOption } from '../api/user-user-option/user-user-option.entity';
import {
	USER_ADMIN_ID_OPTION_FIRSTNAME,
	USER_ADMIN_ID_OPTION_LASTNAME,
	USER_OPTION_FIRSTNAME_ID,
	USER_OPTION_LASTNAME_ID,
	USER_ADMIN_ID,
} from './consts';

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
				id: USER_ADMIN_ID_OPTION_FIRSTNAME,
				userOptionId: USER_OPTION_FIRSTNAME_ID,
				userId: USER_ADMIN_ID,
				content: 'super',
			}, {
				id: USER_ADMIN_ID_OPTION_LASTNAME,
				userOptionId: USER_OPTION_LASTNAME_ID,
				userId: USER_ADMIN_ID,
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