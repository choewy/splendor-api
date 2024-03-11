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

  @ApiResponseProperty({ type: String })
  credit: number;

  @ApiResponseProperty({ type: String })
  point: number;

  @ApiResponseProperty({ type: Number })
  followingCount: number;

  @ApiResponseProperty({ type: Number })
  followerCount: number;

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
    this.credit = user.userWallet?.credit ?? 0;
    this.point = user.userWallet?.point ?? 0;
    this.followingCount = user.userFollowCount?.followings ?? 0;
    this.followerCount = user.userFollowCount?.followers ?? 0;
    this.oauths = user.oauths ? user.oauths.map((oauth) => new ProfileOAuthDto(oauth)) : [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
