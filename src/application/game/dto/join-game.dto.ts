import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGameDTO {
  @ApiProperty({ type: String, description: '게임 번호' })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}
