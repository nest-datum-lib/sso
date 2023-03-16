import { Test, TestingModule } from '@nestjs/testing';
import { RoleAccessTcpController } from './role-access-tcp.controller';

describe('RoleAccessTcpController', () => {
	let controller: RoleAccessTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleAccessTcpController],
		}).compile();

		controller = module.get<RoleAccessTcpController>(RoleAccessTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
