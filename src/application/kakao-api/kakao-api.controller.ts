import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { KakaoLoginCallbackQueryParamDTO } from './dto/kakao-login-callback-query-param.dto';
import { KakaoApiService } from './kakao-api.service';

@ApiTags('카카오 API')
@Controller('api/kakao')
export class KakaoApiController {
  constructor(private readonly kakaoApiService: KakaoApiService) {}

  @Get('login')
  async redirectLoginPage(@Res() response: Response) {
    return this.kakaoApiService.redirectLoginPage(response);
  }

  @Get('login/callback')
  async callbackKakaoLogin(@Res() response: Response, @Query() queryParam: KakaoLoginCallbackQueryParamDTO) {
    return this.kakaoApiService.callbackKakaoLogin(response, queryParam);
  }
}
