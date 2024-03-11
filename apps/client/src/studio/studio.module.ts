import {
  ForbiddenWordRepository,
  StudioDonationSettingRepository,
  StudioPlaySettingRepository,
  StudioRepository,
  StudioStreamSettingRepository,
} from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';

@Module({
  imports: [
    TypeOrmLibsModule.forFeature([
      StudioRepository,
      StudioPlaySettingRepository,
      StudioDonationSettingRepository,
      StudioStreamSettingRepository,
      ForbiddenWordRepository,
    ]),
  ],
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}
