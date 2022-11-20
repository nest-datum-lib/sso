import { Test, TestingModule } from '@nestjs/testing';
import { RoleOptionService } from './role-option.service';

describe('RoleOptionService', () => {
	let service: RoleOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RoleOptionService],
		}).compile();

		service = module.get<RoleOptionService>(RoleOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
