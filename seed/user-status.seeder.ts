import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { UserStatus } from 'src/api/user-status/user-status.entity';

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
				id: 'user-status-active',
				name: 'Active',
				description: 'User is active',
			}], async (data) => {
				try {
					await this.userStatusRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: user-status 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: user-status 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}