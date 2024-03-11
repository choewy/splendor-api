import { FollowEntity, UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class SearchedUserDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: String })
  profileImageUrl: string;

  @ApiResponseProperty({ type: String })
  introduction: string;

  @ApiResponseProperty({ type: Number })
  followingCount: number;

  @ApiResponseProperty({ type: Number })
  followerCount: number;

  @ApiResponseProperty({ type: Boolean })
  followed: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
    this.introduction = user.studio?.studioSetting?.introduction ?? '';
    this.followingCount = user.userFollowCount?.followings ?? 0;
    this.followerCount = user.userFollowCount?.followers ?? 0;
    this.followed = user.followed instanceof FollowEntity;
  }
}
