import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetFollowsDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  nickname?: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  skip: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  take: number;
}
