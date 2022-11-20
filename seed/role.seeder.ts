import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { Role } from 'src/api/role/role.entity';
import { RoleStatus } from 'src/api/role-status/role-status.entity';
import { RoleAccess } from 'src/api/role-access/role-access.entity';

export class RoleSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(RoleStatus) private readonly roleStatusRepository: Repository<RoleStatus>,
		@InjectRepository(RoleAccess) private readonly roleAccessRepository: Repository<RoleAccess>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'role-admin',
				name: 'Admin',
				description: 'Full access to all services.',
				roleStatusId: 'role-status-active',
				isNotDelete: true,
				userId: 'admin',
			}, {
				id: 'role-preload',
				name: 'Preload',
				description: 'User waiting for account validation after registration.',
				roleStatusId: 'role-status-active',
				isNotDelete: true,
				userId: 'admin',
			}], async (data) => {
				try {
					await this.roleRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: user 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: user 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}