import { IsNotEmpty, IsString } from 'class-validator';

export class KakaoLoginCallbackQueryParamDTO {
  @IsString()
  @IsNotEmpty()
  code: string;
}
