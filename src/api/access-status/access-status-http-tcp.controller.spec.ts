import { Test, TestingModule } from '@nestjs/testing';
import { AccessStatusHttpTcpController } from './access-status-http-tcp.controller';

describe('AccessStatusHttpTcpController', () => {
	let controller: AccessStatusHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessStatusHttpTcpController],
		}).compile();

		controller = module.get<AccessStatusHttpTcpController>(AccessStatusHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
