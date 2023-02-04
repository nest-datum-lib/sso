import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SettingService as NestDatumSettinService } from '@nest-datum/setting';
import { CacheService } from '@nest-datum/cache';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService extends NestDatumSettinService {
	public entityConstructor = Setting;

	constructor(
		@InjectRepository(Setting) public repository: Repository<Setting>,
		public connection: Connection,
		public cacheService: CacheService,
	) {
		super(repository, connection, cacheService);
	}
}
