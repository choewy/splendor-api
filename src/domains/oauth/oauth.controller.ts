import { PassportJwtGuard, PassportJwtPayload, ReqJwtPayload } from '@libs/passport';
import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  GetOAuthAuthorizeUrlDto,
  OAuthAuthorizeGoogleRedirectQueryDto,
  OAuthAuthorizeKakaoRedirectQueryDto,
  OAuthAuthorizeNaverRedirectQueryDto,
  OAuthAuthorizeUrlDto,
} from './dtos';
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

  @Post('connect')
  @UseGuards(PassportJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'OAuth 계정 연동하기' })
  @ApiCreatedResponse({ type: OAuthAuthorizeUrlDto })
  async connectOAuthAccount(@ReqJwtPayload() jwtPayload: PassportJwtPayload, @Body() body: GetOAuthAuthorizeUrlDto) {
    return this.oauthService.connectOAuthAccount(jwtPayload.userId, body.platform);
  }

  @Get('google')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Google 계정으로 로그인/회원가입', description: 'Google 인증 Redirect' })
  async signWithGoogle(@Res({ passthrough: true }) res: Response, @Query() query: OAuthAuthorizeGoogleRedirectQueryDto) {
    return this.oauthService.signWithGoogle(res, query.code, Number(query.state));
  }

  @Get('kakao')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Kakao 계정으로 로그인/회원가입', description: 'Kakao 인증 Redirect' })
  async signWithKakao(@Res({ passthrough: true }) res: Response, @Query() query: OAuthAuthorizeKakaoRedirectQueryDto) {
    return this.oauthService.signWithKakao(res, query.code, Number(query.state));
  }

  @Get('naver')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Naver 계정으로 로그인/회원가입', description: 'Naver 인증 Redirect' })
  async signWithNaver(@Res({ passthrough: true }) res: Response, @Query() query: OAuthAuthorizeNaverRedirectQueryDto) {
    return this.oauthService.signWithNaver(res, query.code, Number(query.state));
  }
}
