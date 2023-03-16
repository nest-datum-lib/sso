import { Test, TestingModule } from '@nestjs/testing';
import { RoleTcpController } from './role-tcp.controller';

describe('RoleTcpController', () => {
	let controller: RoleTcpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleTcpController],
		}).compile();

		controller = module.get<RoleTcpController>(RoleTcpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
