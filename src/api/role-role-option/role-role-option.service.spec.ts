import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoleOptionService } from './role-role-option.service';

describe('RoleRoleOptionService', () => {
	let service: RoleRoleOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RoleRoleOptionService],
		}).compile();

		service = module.get<RoleRoleOptionService>(RoleRoleOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
