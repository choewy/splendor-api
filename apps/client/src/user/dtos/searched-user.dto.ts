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

  @ApiResponseProperty({ type: Boolean })
  following: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
    this.introduction = user.studio?.studioSetting?.introduction ?? '';
    this.following = user.following instanceof FollowEntity;
  }
}
