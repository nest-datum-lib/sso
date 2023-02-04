import { Module } from '@nestjs/common';
import { redis } from '@nest-datum-common/config';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from './redis.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ 
		ReplicaService,
		RedisService,
	],
})
export class RedisModule {
}
