import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatusController } from './role-status.controller';

describe('RoleStatusController', () => {
	let controller: RoleStatusController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleStatusController],
		}).compile();

		controller = module.get<RoleStatusController>(RoleStatusController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
