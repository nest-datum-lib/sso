import { Module } from '@nestjs/common';
import { ReplicaService } from './replica.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ ReplicaService ],
})
export class ReplicaModule {
}
