import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangePlayerReadyStatus {
  @ApiProperty({ type: Boolean, description: '준비여부' })
  @IsBoolean()
  @IsNotEmpty()
  isReady: boolean;
}
