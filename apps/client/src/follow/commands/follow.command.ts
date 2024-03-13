import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class FollowCommand {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  follow: boolean;
}
