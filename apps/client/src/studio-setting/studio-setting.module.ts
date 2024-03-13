import { StudioDonationSettingRepository, StudioPlaySettingRepository, StudioRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { StudioSettingController } from './studio-setting.controller';
import { StudioSettingService } from './studio-setting.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([StudioRepository, StudioPlaySettingRepository, StudioDonationSettingRepository])],
  controllers: [StudioSettingController],
  providers: [StudioSettingService],
})
export class StudioSettingModuie {}
