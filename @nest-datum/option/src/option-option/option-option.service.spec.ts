import { Test, TestingModule } from '@nestjs/testing';
import { OptionOptionService } from './option-option.service';

describe('OptionOptionService', () => {
	let service: OptionOptionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OptionOptionService],
		}).compile();

		service = module.get<OptionOptionService>(OptionOptionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
