import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { KakaoLoginCallbackQueryParamDTO } from './dto/kakao-login-callback-query-param.dto';
import { KakaoApiService } from './kakao-api.service';

@ApiTags('카카오 API')
@Controller('api/kakao')
export class KakaoApiController {
  constructor(private readonly kakaoApiService: KakaoApiService) {}

  @Get('login')
  @ApiOperation({ summary: '카카오 로그인 페이지 호출', deprecated: true })
  async redirectLoginPage(@Res() response: Response) {
    return this.kakaoApiService.redirectLoginPage(response);
  }

  @Get('login/callback')
  @ApiOperation({ summary: '카카오 로그인 콜백', deprecated: true })
  async callbackKakaoLogin(@Res() response: Response, @Query() queryParam: KakaoLoginCallbackQueryParamDTO) {
    return this.kakaoApiService.callbackKakaoLogin(response, queryParam);
  }
}
