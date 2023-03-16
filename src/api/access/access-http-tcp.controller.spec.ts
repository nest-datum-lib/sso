import { Test, TestingModule } from '@nestjs/testing';
import { AccessHttpTcpController } from './access-http-tcp.controller';

describe('AccessHttpTcpController', () => {
	let controller: AccessHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessHttpTcpController],
		}).compile();

		controller = module.get<AccessHttpTcpController>(AccessHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
