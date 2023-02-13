import { Test, TestingModule } from '@nestjs/testing';
import { OptionTcpController } from './option-tcp.controller';

describe('OptionTcpController', () => {
	let controller: OptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OptionTcpController],
		}).compile();

		controller = module.get<OptionTcpController>(OptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
