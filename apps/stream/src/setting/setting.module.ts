import { StudioPlaySettingRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { SettingMessageController } from './setting-message.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([StudioPlaySettingRepository])],
  providers: [SettingMessageController, SettingService],
})
export class SettingModule {}
