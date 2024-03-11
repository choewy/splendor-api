import { StudioDonationSettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioDonationSettingDto {
  @ApiResponseProperty({ type: Number })
  min: number;

  @ApiResponseProperty({ type: Number })
  max: number;

  @ApiResponseProperty({ type: Boolean })
  status: boolean;

  constructor(studioDonationSetting: StudioDonationSettingEntity) {
    this.min = studioDonationSetting.min;
    this.max = studioDonationSetting.max;
    this.status = studioDonationSetting.status;
  }
}
