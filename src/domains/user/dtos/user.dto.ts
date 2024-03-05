import { OAuthPlatform } from '@entities/oauth.entity';
import { UserEntity } from '@entities/user.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { UserOAuthDto } from './user-oauth.dto';

export class UserDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: [UserOAuthDto] })
  oauths: UserOAuthDto[];

  constructor(user: UserEntity, currentOAuthPlatform?: OAuthPlatform) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.oauths = user.oauths.map((oauth) => new UserOAuthDto(oauth, currentOAuthPlatform));
  }
}
