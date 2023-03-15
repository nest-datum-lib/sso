import { Module } from '@nestjs/common';
import { LoopService } from './loop.service';
import { QueueService } from './queue.service';

@Module({
	controllers: [],
	imports: [],
	providers: [ 
		LoopService,
		QueueService,
	],
})
export class QueueModule {
}
