import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusHttpTcpController } from './user-status-http-tcp.controller';

describe('UserStatusHttpTcpController', () => {
	let controller: UserStatusHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserStatusHttpTcpController],
		}).compile();

		controller = module.get<UserStatusHttpTcpController>(UserStatusHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
