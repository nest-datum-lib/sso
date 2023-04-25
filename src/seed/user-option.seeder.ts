import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { UserOption } from '../api/user-option/user-option.entity';

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
				id: 'happ-sso-user-option-firstname',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_OPTION_FIRSTNAME',
				name: 'Firstname',
				description: 'User firstname.',
				dataTypeId: 'happ-data-type-text',
				isRequired: true,
				isNotDelete: true,
			}, {
				id: 'happ-sso-user-option-lastname',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_OPTION_LASTNAME',
				name: 'Lastname',
				description: 'User lastname.',
				dataTypeId: 'happ-data-type-text',
				isRequired: true,
				isNotDelete: true,
			}, {
				id: 'happ-sso-user-option-avatar',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_USER_OPTION_AVATAR',
				name: 'Avatar',
				description: 'User avatar.',
				dataTypeId: 'happ-data-type-avatar',
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