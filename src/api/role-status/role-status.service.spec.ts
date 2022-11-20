import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatusService } from './role-status.service';

describe('RoleStatusService', () => {
	let service: RoleStatusService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RoleStatusService],
		}).compile();

		service = module.get<RoleStatusService>(RoleStatusService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
