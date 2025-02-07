import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { TokenProperty } from 'src/domain/types';

export class PurchaseDevelopmentCardDTO implements Partial<TokenProperty> {
  @ApiProperty({ type: Number, description: '카드 번호' })
  @IsInt()
  @IsNotEmpty()
  cardId: number;

  @ApiPropertyOptional({ type: Number, description: '루비' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  ruby?: number;

  @ApiPropertyOptional({ type: Number, description: '사파이어' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  sapphire?: number;

  @ApiPropertyOptional({ type: Number, description: '에메랄드' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  emerald?: number;

  @ApiPropertyOptional({ type: Number, description: '오닉스' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  onyx?: number;

  @ApiPropertyOptional({ type: Number, description: '다이아몬드' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  diamond?: number;

  @ApiPropertyOptional({ type: Number, description: '황금' })
  @Max(3)
  @Min(0)
  @IsInt()
  @IsOptional()
  gold?: number;
}
