import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserOption } from '../api/user-option/user-option.entity';
import {
	USER_OPTION_FIRSTNAME_ID,
	USER_OPTION_LASTNAME_ID,
	USER_OPTION_AVATAR_ID,
	DATA_TYPE_TEXT_ID,
	DATA_TYPE_FILE_SELECT_ID,
	USER_DEFAULT_ID,
} from './consts';

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
				id: USER_OPTION_FIRSTNAME_ID,
				userId: USER_DEFAULT_ID,
				name: 'Firstname',
				description: 'User firstname.',
				dataTypeId: DATA_TYPE_TEXT_ID,
				isRequired: true,
				isNotDelete: true,
			}, {
				id: USER_OPTION_LASTNAME_ID,
				userId: USER_DEFAULT_ID,
				name: 'Lastname',
				description: 'User lastname.',
				dataTypeId: DATA_TYPE_TEXT_ID,
				isRequired: true,
				isNotDelete: true,
			}, {
				id: USER_OPTION_AVATAR_ID,
				userId: USER_DEFAULT_ID,
				name: 'Avatar',
				description: 'User avatar.',
				dataTypeId: DATA_TYPE_FILE_SELECT_ID,
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.userOptionRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: UserOption 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: UserOption 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}