import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PurchaseNobleCardDTO {
  @ApiProperty({ type: Number, description: '카드 번호' })
  @IsNotEmpty()
  cardId: number;
}
