import { Test, TestingModule } from '@nestjs/testing';
import { RoleOptionTcpController } from './role-option-tcp.controller';

describe('RoleOptionTcpController', () => {
	let controller: RoleOptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleOptionTcpController],
		}).compile();

		controller = module.get<RoleOptionTcpController>(RoleOptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
