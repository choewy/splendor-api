import { FollowEntity } from '@libs/entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { FollowUserDto } from './folllow-user.dto';

export class GetFollowersResultDto {
  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: [FollowUserDto] })
  rows: FollowUserDto[];

  constructor(rows: FollowEntity[], total: number, userId: number | null) {
    this.total = total;
    this.rows = rows.map((row) => new FollowUserDto(row.from, row.toId === userId, row.fromId === userId));
  }
}
