import { Test, TestingModule } from '@nestjs/testing';
import { RoleHttpTcpController } from './role-http-tcp.controller';

describe('RoleHttpTcpController', () => {
	let controller: RoleHttpTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleHttpTcpController],
		}).compile();

		controller = module.get<RoleHttpTcpController>(RoleHttpTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
