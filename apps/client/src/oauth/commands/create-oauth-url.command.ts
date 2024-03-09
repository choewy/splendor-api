import { OAuthPlatform } from '@libs/entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl } from 'class-validator';

export class CreateOAuthUrlCommand {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  platform: OAuthPlatform;

  @ApiProperty({ type: String, example: 'http://localhost:3000/sign' })
  @IsUrl({ require_tld: false })
  redirectUrl: string;
}
