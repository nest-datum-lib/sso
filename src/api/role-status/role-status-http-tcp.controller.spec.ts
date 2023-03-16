import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatusHttpTcpController } from './role-status-http-tcp.controller';

describe('RoleStatusHttpTcpController', () => {
	let controller: RoleStatusHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleStatusHttpTcpController],
		}).compile();

		controller = module.get<RoleStatusHttpTcpController>(RoleStatusHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
