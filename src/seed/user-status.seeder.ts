import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '../api/user-status/user-status.entity';
import {
	USER_DEFAULT_ID,
	USER_STATUS_ACTIVE_ID,
	USER_STATUS_NEW_ID,
} from './consts';

export class UserStatusSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(UserStatus) private readonly userStatusRepository: Repository<UserStatus>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: USER_STATUS_ACTIVE_ID,
				userId: USER_DEFAULT_ID,
				name: 'Active',
				description: 'User is active.',
				isNotDelete: true,
			}, {
				id: USER_STATUS_NEW_ID,
				userId: USER_DEFAULT_ID,
				name: 'New',
				description: 'New user.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.userStatusRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: UserStatus 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: UserStatus 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}