import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoleOptionController } from './role-role-option.controller';

describe('RoleRoleController', () => {
	let controller: RoleRoleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleRoleController],
		}).compile();

		controller = module.get<RoleRoleController>(RoleRoleController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
