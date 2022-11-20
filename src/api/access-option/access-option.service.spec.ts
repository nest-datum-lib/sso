import { Test, TestingModule } from '@nestjs/testing';
import { AccessOptionService } from './access-option.service';

describe('AccessOptionService', () => {
	let service: AccessOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccessOptionService],
		}).compile();

		service = module.get<AccessOptionService>(AccessOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
