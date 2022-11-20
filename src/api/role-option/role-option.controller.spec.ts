import { Test, TestingModule } from '@nestjs/testing';
import { RoleOptionController } from './role-option.controller';

describe('RoleOptionController', () => {
	let controller: RoleOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoleOptionController],
		}).compile();

		controller = module.get<RoleOptionController>(RoleOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
