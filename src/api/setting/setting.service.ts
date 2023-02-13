import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SettingService as BaseSettingService } from '@nest-datum/setting';
import { CacheService } from '@nest-datum/cache';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService extends BaseSettingService {
	protected entityConstructor = Setting;

	constructor(
		@InjectRepository(Setting) protected entityRepository: Repository<Setting>,
		protected connection: Connection,
		protected cacheService: CacheService,
	) {
		super();
	}
}
