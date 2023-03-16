import { Test, TestingModule } from '@nestjs/testing';
import { AccessOptionHttpTcpController } from './access-option-http-tcp.controller';

describe('AccessOptionHttpTcpController', () => {
	let controller: AccessOptionHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessOptionHttpTcpController],
		}).compile();

		controller = module.get<AccessOptionHttpTcpController>(AccessOptionHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
