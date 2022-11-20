import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { RoleRoleOption } from 'src/api/role-role-option/role-role-option.entity';

export class RoleRoleOptionSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(RoleRoleOption) private readonly roleRoleOptionRepository: Repository<RoleRoleOption>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([/*{
				roleId: 'example',
				roleOptionId: 'example-option',
			}*/], async (data) => {
				try {
					await this.roleRoleOptionRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: role-role-option 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: role-role-option 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}