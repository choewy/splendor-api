import { StudioEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class SearchedUserStudioDto {
  @ApiResponseProperty({ type: String })
  alias: string;

  @ApiResponseProperty({ type: String })
  introduction: string;

  constructor(studio: StudioEntity) {
    this.alias = studio.alias;
    this.introduction = studio.introduction;
  }
}
