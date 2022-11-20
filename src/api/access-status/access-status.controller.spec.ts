import { Test, TestingModule } from '@nestjs/testing';
import { AccessStatusController } from './access-status.controller';

describe('AccessStatusController', () => {
	let controller: AccessStatusController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessStatusController],
		}).compile();

		controller = module.get<AccessStatusController>(AccessStatusController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
