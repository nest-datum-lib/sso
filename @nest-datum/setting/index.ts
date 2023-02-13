import { SettingModule } from './src/setting.module';
import { SettingService } from './src/setting.service';
import { SettingTcpController } from './src/setting-tcp.controller';
import { SettingHttpController } from './src/setting-http.controller';
import { SettingHttpTcpController } from './src/setting-http-tcp.controller';
import { Setting } from './src/setting.entity';

export {
	SettingModule,
	SettingTcpController,
	SettingHttpController,
	SettingHttpTcpController,
	SettingService,
	Setting,
};