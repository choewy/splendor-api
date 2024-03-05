import { ApiResponseProperty } from '@nestjs/swagger';

export class KakaoAuthorizeResultDto {
  @ApiResponseProperty({ type: String })
  code?: string;

  @ApiResponseProperty({ type: String })
  error?: string;

  @ApiResponseProperty({ type: String })
  error_description?: string;

  @ApiResponseProperty({ type: String })
  state?: string;
}
