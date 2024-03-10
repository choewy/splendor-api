import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokensCommand {
  @ApiProperty({ type: String })
  @IsString()
  refresh: string;
}
