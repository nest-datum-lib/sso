import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoleOptionController } from './role-role-option.controller';

describe('RoleRoleOptionController', () => {
	let controller: RoleRoleOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleRoleOptionController],
		}).compile();

		controller = module.get<RoleRoleOptionController>(RoleRoleOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
