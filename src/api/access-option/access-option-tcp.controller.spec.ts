import { Test, TestingModule } from '@nestjs/testing';
import { AccessOptionTcpController } from './access-option-tcp.controller';

describe('AccessOptionTcpController', () => {
	let controller: AccessOptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessOptionTcpController],
		}).compile();

		controller = module.get<AccessOptionTcpController>(AccessOptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
