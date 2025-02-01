import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetKakaoLoginPageURIParamDTO } from './dto/get-kakao-login-uri-param.dto';
import { LoginWithKakoDTO } from './dto/login-with-kakao.dto';
import { KakaoApiService } from './kakao-api.service';
import { ServiceTokenDTO } from '../auth/dto/service-token.dto';

@ApiTags('카카오 API')
@Controller('api/kakao')
export class KakaoApiController {
  constructor(private readonly kakaoApiService: KakaoApiService) {}

  @Get('login')
  @ApiOperation({ summary: '카카오 로그인 페이지 URI' })
  async getLoginURI(@Query() queryParam: GetKakaoLoginPageURIParamDTO) {
    return this.kakaoApiService.getKakaoLoginURI(queryParam);
  }

  @Post('login')
  @ApiOperation({ summary: '카카오 계정으로 서비스 계정 로그인' })
  @ApiCreatedResponse({ type: ServiceTokenDTO })
  async loginWithKakao(@Body() body: LoginWithKakoDTO) {
    return this.kakaoApiService.loginWithKakao(body);
  }
}
