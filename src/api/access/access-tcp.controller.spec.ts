import { Test, TestingModule } from '@nestjs/testing';
import { AccessTcpController } from './access-tcp.controller';

describe('AccessTcpController', () => {
	let controller: AccessTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessTcpController],
		}).compile();

		controller = module.get<AccessTcpController>(AccessTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
