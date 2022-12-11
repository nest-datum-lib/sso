import { Test, TestingModule } from '@nestjs/testing';
import { AccessAccessOptionService } from './access-access-option.service';

describe('AccessAccessOptionService', () => {
	let service: AccessAccessOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccessAccessOptionService],
		}).compile();

		service = module.get<AccessAccessOptionService>(AccessAccessOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
