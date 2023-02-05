import { Test, TestingModule } from '@nestjs/testing';
import { UserOptionService } from './user-option.service';

describe('UserOptionService', () => {
	let service: UserOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserOptionService],
		}).compile();

		service = module.get<UserOptionService>(UserOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
