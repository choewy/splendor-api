import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokensDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  access: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  refresh: string;
}
