import { Test, TestingModule } from '@nestjs/testing';
import { RoleOptionHttpTcpController } from './role-option-http-tcp.controller';

describe('RoleOptionHttpTcpController', () => {
	let controller: RoleOptionHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleOptionHttpTcpController],
		}).compile();

		controller = module.get<RoleOptionHttpTcpController>(RoleOptionHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
