import { Test, TestingModule } from '@nestjs/testing';
import { OptionOptionController } from './option-option.controller';

describe('OptionOptionController', () => {
	let controller: OptionOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OptionOptionController],
		}).compile();

		controller = module.get<OptionOptionController>(OptionOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
