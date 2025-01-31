import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CardLevel, CardPosition } from 'src/domain/enums';

export class KeepCardDTO {
  @ApiProperty({ type: String, enum: CardPosition, description: '카드 위치' })
  @IsEnum(CardPosition)
  @IsNotEmpty()
  position: CardPosition;

  @ApiPropertyOptional({ type: Number, enum: CardLevel, description: '카드 레벨(덱에 쌓인 카드를 찜하는 경우 필수)' })
  @IsEnum(CardLevel)
  @IsOptional()
  level?: CardLevel;

  @ApiPropertyOptional({ type: Number, description: '카드 번호(필드에 노출된 카드를 찜하는 경우 필수)' })
  @IsInt()
  @IsOptional()
  cardId?: number;
}
