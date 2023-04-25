import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../api/role/role.entity';

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
				id: 'happ-sso-role-admin',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ROLE_ADMIN',
				roleStatusId: 'happ-sso-role-status-active',
				name: 'Admin',
				description: 'Admin role.',
				isNotDelete: true,
			}, {
				id: 'happ-sso-role-member',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ROLE_MEMBER',
				roleStatusId: 'happ-sso-role-status-active',
				name: 'Member',
				description: 'Member role.',
				isNotDelete: true,
			}, {
				id: 'happ-sso-role-manager',
				userId: process.env.USER_ID,
				envKey: 'HAPP_SSO_ROLE_MANAGER',
				roleStatusId: 'happ-sso-role-status-active',
				name: 'Manager',
				description: 'Manager role.',
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