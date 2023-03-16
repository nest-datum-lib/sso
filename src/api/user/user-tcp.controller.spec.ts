import { Test, TestingModule } from '@nestjs/testing';
import { UserTcpController } from './user-tcp.controller';

describe('UserTcpController', () => {
	let controller: UserTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserTcpController],
		}).compile();

		controller = module.get<UserTcpController>(UserTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
