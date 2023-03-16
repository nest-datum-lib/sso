import { Test, TestingModule } from '@nestjs/testing';
import { UserOptionTcpController } from './user-option-tcp.controller';

describe('UserOptionTcpController', () => {
	let controller: UserOptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserOptionTcpController],
		}).compile();

		controller = module.get<UserOptionTcpController>(UserOptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
