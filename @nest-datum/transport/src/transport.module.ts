import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { redis } from '@nest-datum-common/config';
import { ReplicaService } from '@nest-datum/replica';
import { TransportService } from './transport.service';

@Module({
	imports: [ RedisModule.forRoot(redis) ],
	controllers: [],
	providers: [ 
		ReplicaService,
		TransportService,
	],
})
export class TransportModule {
}
