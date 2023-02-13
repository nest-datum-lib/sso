import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { AccessStatus } from '../api/access-status/access-status.entity';
import {
	USER_DEFAULT_ID,
	ACCESS_STATUS_ACTIVE_ID,
} from './consts';

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
				id: ACCESS_STATUS_ACTIVE_ID,
				userId: USER_DEFAULT_ID,
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