import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class FollowCommand {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  userId: number;
}
