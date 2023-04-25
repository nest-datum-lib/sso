import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { Access } from '../api/access/access.entity';

export class AccessSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Access) private readonly accessRepository: Repository<Access>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'happ-sso-access-root',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ACCESS_ROOT',
				accessStatusId: 'happ-sso-access-status-active',
				name: 'Root',
				description: 'Full admin access.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.accessRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: Access 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: Access 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}