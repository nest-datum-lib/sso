import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { RoleStatus } from '../api/role-status/role-status.entity';

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
				id: 'happ-sso-role-status-active',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ROLE_STATUS_ACTIVE',
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