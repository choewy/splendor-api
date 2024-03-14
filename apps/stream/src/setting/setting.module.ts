import { Module } from '@nestjs/common';

import { SettingEventController } from './setting-event.controller';
import { SettingService } from './setting.service';

@Module({ providers: [SettingEventController, SettingService] })
export class SettingModule {}
