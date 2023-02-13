import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../api/role/role.entity';
import {
	USER_DEFAULT_ID,
	ROLE_STATUS_ACTIVE_ID,
	ROLE_ADMIN_ID,
	ROLE_MEMBER_ID,
} from './consts';

export class RoleSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: ROLE_ADMIN_ID,
				userId: USER_DEFAULT_ID,
				roleStatusId: ROLE_STATUS_ACTIVE_ID,
				name: 'Admin',
				description: 'Admin role.',
				isNotDelete: true,
			}, {
				id: ROLE_MEMBER_ID,
				userId: USER_DEFAULT_ID,
				roleStatusId: ROLE_STATUS_ACTIVE_ID,
				name: 'Member',
				description: 'Member.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.roleRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: Role 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: Role 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}