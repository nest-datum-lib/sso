import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { find } from '@nest-datum-utils/env';

const configArr: Array<any> = find([ 'SQL_SLAVE', '_HOST' ], (key) => ({
	host: process.env[`SQL_SLAVE${key}_HOST`],
	port: Number(process.env[`SQL_SLAVE${key}_PORT`]),
	username: process.env[`SQL_SLAVE${key}_USER`],
	password: process.env[`SQL_SLAVE${key}_USER_PASSWORD`],
	database: process.env[`SQL_SLAVE${key}_DATABASE`],
}));

export const sql: TypeOrmModuleOptions = {
	type: 'mysql',
	...(configArr.length > 0)
		? {
			replication: {
				master: {
					host: process.env.SQL_MASTER_HOST,
					port: Number(process.env.SQL_MASTER_PORT),
					username: process.env.SQL_MASTER_USER,
					password: process.env.SQL_MASTER_USER_PASSWORD,
					database: process.env.SQL_MASTER_DATABASE,
				},
				slaves: [ ...configArr ],
			},
		}
		: {
			host: process.env.SQL_HOST || process.env.SQL_MASTER_HOST,
			port: Number(process.env.SQL_PORT || process.env.SQL_MASTER_PORT),
			username: process.env.SQL_USER || process.env.SQL_MASTER_USER,
			password: process.env.SQL_USER_PASSWORD || process.env.SQL_MASTER_USER_PASSWORD,
			database: process.env.SQL_DATABASE || process.env.SQL_MASTER_DATABASE,
		},
	autoLoadEntities: true,
	synchronize: true,
};
