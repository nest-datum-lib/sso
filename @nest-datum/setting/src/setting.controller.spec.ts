import { Test, TestingModule } from '@nestjs/testing';
import { SettingTcpController } from './setting-tcp.controller';

describe('SettingTcpController', () => {
	let controller: SettingTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SettingTcpController],
		}).compile();

		controller = module.get<SettingTcpController>(SettingTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
