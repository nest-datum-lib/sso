import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoleOptionHttpTcpController } from './role-role-option-http-tcp.controller';

describe('RoleRoleOptionHttpTcpController', () => {
	let controller: RoleRoleOptionHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleRoleOptionHttpTcpController],
		}).compile();

		controller = module.get<RoleRoleOptionHttpTcpController>(RoleRoleOptionHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
