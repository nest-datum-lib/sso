import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusTcpController } from './user-status-tcp.controller';

describe('UserStatusTcpController', () => {
	let controller: UserStatusTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserStatusTcpController],
		}).compile();

		controller = module.get<UserStatusTcpController>(UserStatusTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
