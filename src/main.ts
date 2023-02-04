require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { 
	onExit,
	onWarning,
	onUncaughtException, 
} from '@nest-datum-common/process';
import { CustomServerTCP } from '@nest-datum-common/strategies';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { AppModule } from './app.module';

process.on('exit', onExit);
process.on('warning', onWarning);
process.on('uncaughtException', onUncaughtException);

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new CustomServerTCP({
			host: process.env.APP_HOST,
			port: Number(process.env.APP_PORT),
		}),
	});
	const transport = await NestFactory.create(TransportModule);
	const transportService = transport.get(TransportService);

	try {
		await transportService.create()
		await app.listen()
		await transport.close();

		console.log(`Successfuly started on "${process.env.APP_HOST}:${process.env.APP_PORT}".`);
	}
	catch (err) {
		await app.close();
		
		console.error(err.message);
	}
};

bootstrap();
