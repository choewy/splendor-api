import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateGameDTO {
  @ApiProperty({ type: String, description: '방 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: String, description: '방 비밀번호' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ type: Number, description: '턴 제한시간(30초 ~ 300초)' })
  @Max(300)
  @Min(30)
  @IsInt()
  @IsNotEmpty()
  waitTime: number;

  @ApiProperty({ type: Number, description: '최대 인원 수(2명 ~ 4명)' })
  @Max(4)
  @Min(2)
  @IsInt()
  @IsNotEmpty()
  maxPlayerCount: number;
}
