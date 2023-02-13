import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { encryptPassword } from '@nest-datum/jwt';
import { User } from '../api/user/user.entity';

export class UserSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'sso-user-admin',
				roleId: 'sso-role-admin',
				userStatusId: 'sso-user-status-active',
				email: 'ihor.bielchenko@gmail.com',
				login: 'admin',
				password: await encryptPassword('XIUnv@#jgfo_r-32i0e(@12oj-f34!'),
				emailVerifyKey: '',
				emailVerifiedAt: new Date(),
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.userRepository.insert(data);
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