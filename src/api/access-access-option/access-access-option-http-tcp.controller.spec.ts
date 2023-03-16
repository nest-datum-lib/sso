import { Test, TestingModule } from '@nestjs/testing';
import { AccessAccessOptionHttpTcpController } from './access-access-option-http-tcp.controller';

describe('AccessAccessOptionHttpTcpController', () => {
	let controller: AccessAccessOptionHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessAccessOptionHttpTcpController],
		}).compile();

		controller = module.get<AccessAccessOptionHttpTcpController>(AccessAccessOptionHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
