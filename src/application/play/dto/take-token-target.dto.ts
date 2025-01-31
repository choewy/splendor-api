import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TakeTokenCount } from 'src/persistent/enums';

export class TakeTokenTargetDTO {
  @ApiProperty({ type: Number, enum: TakeTokenCount, description: '수량' })
  @IsEnum(TakeTokenCount)
  @IsNotEmpty()
  count: number;

  @ApiPropertyOptional({ type: Boolean, description: '버리기 가능 여부(소지 토큰 10개 소지 시 버림 처리)' })
  @IsBoolean()
  @IsOptional()
  optional?: boolean;
}
