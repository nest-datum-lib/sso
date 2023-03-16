import { Test, TestingModule } from '@nestjs/testing';
import { UserOptionHttpTcpController } from './user-option-http-tcp.controller';

describe('UserOptionHttpTcpController', () => {
	let controller: UserOptionHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserOptionHttpTcpController],
		}).compile();

		controller = module.get<UserOptionHttpTcpController>(UserOptionHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
