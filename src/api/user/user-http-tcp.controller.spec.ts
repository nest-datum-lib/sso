import { Test, TestingModule } from '@nestjs/testing';
import { UserHttpTcpController } from './user-http-tcp.controller';

describe('UserHttpTcpController', () => {
	let controller: UserHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserHttpTcpController],
		}).compile();

		controller = module.get<UserHttpTcpController>(UserHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
