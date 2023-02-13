import { Test, TestingModule } from '@nestjs/testing';
import { OptionHttpController } from './option-http.controller';

describe('OptionHttpController', () => {
	let controller: OptionHttpController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OptionHttpController],
		}).compile();

		controller = module.get<OptionHttpController>(OptionHttpController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
