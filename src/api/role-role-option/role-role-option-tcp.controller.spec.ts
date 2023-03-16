import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoleOptionTcpController } from './role-role-option-tcp.controller';

describe('RoleRoleOptionTcpController', () => {
	let controller: RoleRoleOptionTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleRoleOptionTcpController],
		}).compile();

		controller = module.get<RoleRoleOptionTcpController>(RoleRoleOptionTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
