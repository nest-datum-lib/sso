import { SettingModule } from './setting.module';
import { SettingService } from './setting.service';
import { SettingTcpController } from './setting-tcp.controller';
import { SettingHttpController } from './setting-http.controller';
import { SettingHttpTcpController } from './setting-http-tcp.controller';
import { Setting } from './setting.entity';

export {
	SettingModule,
	SettingTcpController,
	SettingHttpController,
	SettingHttpTcpController,
	SettingService,
	Setting,
};