import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { Access } from 'src/api/access/access.entity';
import { AccessStatus } from 'src/api/access-status/access-status.entity';

export class AccessSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Access) private readonly accessRepository: Repository<Access>,
		@InjectRepository(AccessStatus) private readonly accessStatusRepository: Repository<AccessStatus>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'sso-access-admin-panel',
				name: 'Admin panel',
				description: 'Allow to use the admin panel.',
				accessStatusId: 'sso-access-status-active',
				isNotDelete: true,
				userId: 'sso-user-admin',
			}], async (data) => {
				try {
					await this.accessRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: access 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: access 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}