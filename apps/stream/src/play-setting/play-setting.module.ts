import { Module } from '@nestjs/common';

import { PlaySettingMessageController } from './play-setting-message.controller';
import { PlaySettingService } from './play-setting.service';

@Module({
  providers: [PlaySettingMessageController, PlaySettingService],
})
export class PlaySettingModule {}
