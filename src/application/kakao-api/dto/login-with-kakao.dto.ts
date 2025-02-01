import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginWithKakoDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, format: 'url' })
  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}
