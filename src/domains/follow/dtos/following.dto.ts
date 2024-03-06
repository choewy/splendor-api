import { FollowEntity } from '@entities/follow.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export class FollowingDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: String })
  profileImage: string | null;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  @ApiResponseProperty({ type: Number })
  days: number;

  constructor(follow: FollowEntity) {
    this.id = follow.to.id;
    this.nickname = follow.to.nickname;
    this.profileImage = follow.to.userProfileImage?.key ?? null;
    this.createdAt = follow.createdAt;
    this.days = -Math.floor(DateTime.fromJSDate(follow.createdAt).diffNow('days').get('days'));
  }
}
