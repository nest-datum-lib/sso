import { Test, TestingModule } from '@nestjs/testing';
import { AccessStatusTcpController } from './access-status-tcp.controller';

describe('AccessStatusTcpController', () => {
	let controller: AccessStatusTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessStatusTcpController],
		}).compile();

		controller = module.get<AccessStatusTcpController>(AccessStatusTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
