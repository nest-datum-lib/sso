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
	protected readonly repositoryConstructor = Setting;

	constructor(
		@InjectRepository(Setting) protected readonly repository: Repository<Setting>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}
}
