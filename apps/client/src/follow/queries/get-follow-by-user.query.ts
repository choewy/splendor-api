import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetFollowByUserQuery {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  userId: number;
}
