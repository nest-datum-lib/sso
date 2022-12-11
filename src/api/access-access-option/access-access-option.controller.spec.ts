import { Test, TestingModule } from '@nestjs/testing';
import { AccessAccessOptionController } from './access-access-option.controller';

describe('AccessAccessController', () => {
	let controller: AccessAccessController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessAccessController],
		}).compile();

		controller = module.get<AccessAccessController>(AccessAccessController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
