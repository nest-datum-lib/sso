import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { AccessStatus } from 'src/api/access-status/access-status.entity';

export class AccessStatusSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(AccessStatus) private readonly accessStatusRepository: Repository<AccessStatus>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'sso-access-status-active',
				name: 'Active',
				description: 'Access is active',
				userId: 'sso-user-admin',
			}], async (data) => {
				try {
					await this.accessStatusRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: access-status 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: access-status 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}