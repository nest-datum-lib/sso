import { Test, TestingModule } from '@nestjs/testing';
import { AccessOptionController } from './access-option.controller';

describe('AccessOptionController', () => {
	let controller: AccessOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessOptionController],
		}).compile();

		controller = module.get<AccessOptionController>(AccessOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
