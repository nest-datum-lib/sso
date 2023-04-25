import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { AccessStatus } from '../api/access-status/access-status.entity';

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
				id: 'happ-sso-access-status-active',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ACCESS_STATUS_ACTIVE',
				name: 'Active',
				description: 'Role is active.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.accessStatusRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: AccessStatus 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: AccessStatus 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}