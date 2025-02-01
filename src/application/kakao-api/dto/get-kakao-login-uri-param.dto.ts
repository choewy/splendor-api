import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetKakaoLoginPageURIParamDTO {
  @ApiProperty({ type: String, format: 'url' })
  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}
