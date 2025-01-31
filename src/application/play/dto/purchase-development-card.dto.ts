import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class PurchaseDevelopmentCardDTO {
  @ApiProperty({ type: Number, description: '카드 번호' })
  @IsInt()
  @IsNotEmpty()
  cardId: number;

  @ApiPropertyOptional({ type: Boolean, description: '토파즈 사용 여부' })
  @IsBoolean()
  @IsOptional()
  useTopaz?: boolean;
}
