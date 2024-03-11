import { StudioDonationSettingRepository, StudioPlaySettingRepository, StudioStreamSettingRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudioSettingService {
  constructor(
    private readonly studioPlaySettingRepository: StudioPlaySettingRepository,
    private readonly studioDonationSettingRepository: StudioDonationSettingRepository,
    private readonly studioStreamSettingRepository: StudioStreamSettingRepository,
  ) {}
}
