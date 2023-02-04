import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { encryptPassword } from '@nest-datum/jwt';
import { User } from 'src/api/user/user.entity';

export class UserSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {
	}

	async send() {
		console.log('000')

		
		const aaaa = await encryptPassword('XIUnv@#jgfo_r-32i0e(@12oj-f34!')
		const bbbb = new Date();

		console.log('1111')

		console.log('========', {
				id: 'sso-user-admin',
				roleId: 'sso-role-admin',
				userStatusId: 'sso-user-status-active',
				email: 'ihor.bielchenko@gmail.com',
				login: 'admin',
				password: aaaa,
				emailVerifyKey: '',
				emailVerifiedAt: bbbb,
				isNotDelete: true,
			});

		try {
			// new transaction
			await Bluebird.each([{
				id: 'sso-user-admin',
				roleId: 'sso-role-admin',
				userStatusId: 'sso-user-status-active',
				email: 'ihor.bielchenko@gmail.com',
				login: 'admin',
				password: aaaa,
				emailVerifyKey: '',
				emailVerifiedAt: bbbb,
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.userRepository.insert(data);
				}
				catch (err) {
					console.error(`ERROR: user 2: ${err.message}`);
				}
			});
		}
		catch (err) {
			console.error(`ERROR: user 1: ${err.message}`);
		}
		finally {
		}
	}
}