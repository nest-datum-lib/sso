import { Test, TestingModule } from '@nestjs/testing';
import { UserOptionController } from './user-option.controller';

describe('UserOptionController', () => {
	let controller: UserOptionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserOptionController],
		}).compile();

		controller = module.get<UserOptionController>(UserOptionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
