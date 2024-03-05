import { ApiPropertyOptional } from '@nestjs/swagger';

export class OAuthAuthorizeKakaoRedirectQueryDto {
  @ApiPropertyOptional({ type: String })
  code?: string;

  @ApiPropertyOptional({ type: String })
  error?: string;

  @ApiPropertyOptional({ type: String })
  error_description?: string;

  @ApiPropertyOptional({ type: String })
  state?: string;
}
