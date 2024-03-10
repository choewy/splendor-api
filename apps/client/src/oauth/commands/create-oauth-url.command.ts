import { OAuthPlatform } from '@libs/entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl } from 'class-validator';

export class CreateOAuthUrlCommand {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  platform: OAuthPlatform;

  @ApiProperty({ type: String, example: 'http://localhost:3000/sign/ok' })
  @IsUrl({ require_tld: false })
  successUrl: string;

  @ApiProperty({ type: String, example: 'http://localhost:3000/sign/error' })
  @IsUrl({ require_tld: false })
  failUrl: string;
}
