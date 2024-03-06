import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTokensDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
