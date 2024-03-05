import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OAuthAuthorizeNaverRedirectQueryDto {
  @ApiProperty({ type: String })
  state: string;

  @ApiPropertyOptional({ type: String })
  code?: string;

  @ApiPropertyOptional({ type: String })
  error?: string;

  @ApiPropertyOptional({ type: String })
  error_description?: string;
}
