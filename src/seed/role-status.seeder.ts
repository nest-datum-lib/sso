import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { RoleStatus } from '../api/role-status/role-status.entity';
import {
	USER_DEFAULT_ID,
	ROLE_STATUS_ACTIVE_ID,
} from './consts';

export class RoleStatusSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(RoleStatus) private readonly roleStatusRepository: Repository<RoleStatus>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: ROLE_STATUS_ACTIVE_ID,
				userId: USER_DEFAULT_ID,
				name: 'Active',
				description: 'Role is active.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.roleStatusRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: RoleStatus 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: RoleStatus 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}