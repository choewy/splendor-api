import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GetOAuthAuthorizeUrlDto, OAuthAuthorizeKakaoRedirectQueryDto, OAuthAuthorizeUrlDto } from './dtos';
import { OAuthService } from './services';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post()
  @ApiOperation({ summary: 'OAuth 인증 URL 가져오기' })
  @ApiCreatedResponse({ type: OAuthAuthorizeUrlDto })
  async getOAuthAuthorizeUrl(@Body() body: GetOAuthAuthorizeUrlDto) {
    return this.oauthService.getOAuthAuthorizeUrl(body.platform);
  }

  @Get('kakao')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Kakao 계정으로 로그인/회원가입', description: 'Kakao 인증 Redirect' })
  async signWithKakao(@Res({ passthrough: true }) res: Response, @Query() query: OAuthAuthorizeKakaoRedirectQueryDto) {
    console.log(query);

    return this.oauthService.signWithKakao(res, query.code);
  }
}
