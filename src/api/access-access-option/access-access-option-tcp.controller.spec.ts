import { Test, TestingModule } from '@nestjs/testing';
import { AccessAccessOptionTcpController } from './access-access-option-tcp.controller';

describe('AccessAccessOptionTcpController', () => {
	let controller: AccessAccessOptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessAccessOptionTcpController],
		}).compile();

		controller = module.get<AccessAccessOptionTcpController>(AccessAccessOptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
