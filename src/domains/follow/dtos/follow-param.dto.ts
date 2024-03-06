import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class FollowParamDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  toId: number;
}
