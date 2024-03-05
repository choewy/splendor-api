import { ApiPropertyOptional } from '@nestjs/swagger';

export class OAuthAuthorizeGoogleRedirectQueryDto {
  @ApiPropertyOptional({ type: String })
  code?: string;

  @ApiPropertyOptional({ type: String })
  scope?: string;

  @ApiPropertyOptional({ type: String })
  authuser?: string;

  @ApiPropertyOptional({ type: String })
  prompt?: 'consent';
}
