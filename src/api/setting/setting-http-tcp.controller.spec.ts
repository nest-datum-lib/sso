import { Test, TestingModule } from '@nestjs/testing';
import { SettingHttpTcpController } from './setting-http-tcp.controller';

describe('SettingHttpTcpController', () => {
	let controller: SettingHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SettingHttpTcpController],
		}).compile();

		controller = module.get<SettingHttpTcpController>(SettingHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
