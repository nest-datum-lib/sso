import { Test, TestingModule } from '@nestjs/testing';
import { StatusTcpController } from './status-tcp.controller';

describe('StatusTcpController', () => {
	let controller: StatusTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatusTcpController],
		}).compile();

		controller = module.get<StatusTcpController>(StatusTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
