import { UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { ProfileOAuthDto } from './profile-oauth.dto';

export class ProfileDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: String })
  profileImageUrl: string;

  @ApiResponseProperty({ type: Number })
  followings: number;

  @ApiResponseProperty({ type: Number })
  followers: number;

  @ApiResponseProperty({ type: [ProfileOAuthDto] })
  oauths: ProfileOAuthDto[];

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  @ApiResponseProperty({ type: Date })
  updatedAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
    this.followings = user.count?.followings ?? 0;
    this.followers = user.count?.followers ?? 0;
    this.oauths = user.oauths ? user.oauths.map((oauth) => new ProfileOAuthDto(oauth)) : [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
