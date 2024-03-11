import { StreamPlatform, StudioStreamSettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioStreamSettingDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: StreamPlatform })
  platform: StreamPlatform;

  @ApiResponseProperty({ type: String })
  url: string;

  @ApiResponseProperty({ type: Boolean })
  status: boolean;

  constructor(studioStreamSetting: StudioStreamSettingEntity) {
    this.id = studioStreamSetting.id;
    this.platform = studioStreamSetting.platform;
    this.url = studioStreamSetting.url;
    this.status = studioStreamSetting.status;
  }
}
