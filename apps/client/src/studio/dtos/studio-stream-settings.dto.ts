import { StudioStreamSettingEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { StudioStreamSettingDto } from './studio-stream-setting.dto';

export class StudioStreamSettingsDto {
  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: [StudioStreamSettingDto] })
  rows: StudioStreamSettingDto[];

  constructor(rows: StudioStreamSettingEntity[], total: number) {
    this.total = total;
    this.rows = rows.map((row) => new StudioStreamSettingDto(row));
  }
}
