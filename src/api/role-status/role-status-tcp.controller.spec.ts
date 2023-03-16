import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatusTcpController } from './role-status-tcp.controller';

describe('RoleStatusTcpController', () => {
	let controller: RoleStatusTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleStatusTcpController],
		}).compile();

		controller = module.get<RoleStatusTcpController>(RoleStatusTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
