import { StudioDonationSettingRepository, StudioPlaySettingRepository, StudioStreamSettingRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioSettingController } from './studio-setting.controller';
import { StudioSettingService } from './studio-setting.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([StudioPlaySettingRepository, StudioDonationSettingRepository, StudioStreamSettingRepository])],
  controllers: [StudioSettingController],
  providers: [StudioSettingService],
})
export class StudioSettingModule {}
