import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '../api/user-status/user-status.entity';

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
				id: 'happ-sso-user-status-active',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_STATUS_ACTIVE',
				name: 'Active',
				description: 'User is active.',
				isNotDelete: true,
			}, {
				id: 'happ-sso-user-status-new',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_STATUS_NEW',
				name: 'New',
				description: 'New user.',
				isNotDelete: true,
			}, {
				id: 'happ-sso-user-status-blocked',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_STATUS_BLOCKED',
				name: 'Blocked',
				description: 'User is blocked.',
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