import { Test, TestingModule } from '@nestjs/testing';
import { AccessAccessOptionController } from './access-access-option.controller';

describe('AccessAccessOptionController', () => {
	let controller: AccessAccessOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessAccessOptionController],
		}).compile();

		controller = module.get<AccessAccessOptionController>(AccessAccessOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
