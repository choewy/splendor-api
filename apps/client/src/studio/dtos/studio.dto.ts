import { StudioEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class StudioDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  alias: string;

  @ApiResponseProperty({ type: String })
  introduction: string;

  @ApiResponseProperty({ type: Number })
  streamSettingCount: number;

  @ApiResponseProperty({ type: Number })
  forbiddenWordsCount: number;

  constructor(studio: StudioEntity, streamSettingCount: number, forbiddenWordsCount: number) {
    this.id = studio.id;
    this.alias = studio.alias;
    this.introduction = studio.introduction;
    this.streamSettingCount = streamSettingCount;
    this.forbiddenWordsCount = forbiddenWordsCount;
  }
}
