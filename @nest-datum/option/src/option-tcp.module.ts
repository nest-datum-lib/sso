import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { OptionService } from './option.service';
import { OptionTcpController } from './option-tcp.controller';

@Module({
	imports: [],
	controllers: [
		OptionTcpController,
	],
	providers: [ 
		OptionService
	],
})
export class OptionTcpModule {
}
