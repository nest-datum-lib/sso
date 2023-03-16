import { Test, TestingModule } from '@nestjs/testing';
import { RoleAccessHttpTcpController } from './role-access-http-tcp.controller';

describe('RoleAccessHttpTcpController', () => {
	let controller: RoleAccessHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleAccessHttpTcpController],
		}).compile();

		controller = module.get<RoleAccessHttpTcpController>(RoleAccessHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
