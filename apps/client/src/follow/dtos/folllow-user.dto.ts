import { UserEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FollowUserDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: String })
  profileImageUrl: string | null;

  @ApiResponseProperty({ type: String })
  introduction: string;

  @ApiResponseProperty({ type: Number })
  followingCount: number;

  @ApiResponseProperty({ type: Number })
  followerCount: number;

  @ApiResponseProperty({ type: Boolean })
  followed: boolean;

  @ApiResponseProperty({ type: Boolean })
  hasOwn: boolean;

  constructor(user: UserEntity, followed: boolean, hasOwn: boolean) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
    this.introduction = user.studio?.introduction ?? '';
    this.followingCount = user.userFollowCount?.followings ?? 0;
    this.followerCount = user.userFollowCount?.followers ?? 0;
    this.followed = followed;
    this.hasOwn = hasOwn;
  }
}
