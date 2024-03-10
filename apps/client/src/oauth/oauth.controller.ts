import { ApiController, ApiPipeException } from '@libs/swagger';
import { Body, Get, Post, Query, Res, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateOAuthUrlCommand, SignFromGoogleCommand, SignFromKakaoCommand, SignFromNaverCommand } from './commands';
import { CreateOAuthUrlDto } from './dtos';
import { OAuthErrorFilter } from './filters';
import { OAuthService } from './oauth.service';

@ApiController('oauth', 'OAuth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post()
  @ApiOperation({ summary: 'OAuth 인증 URL 생성' })
  @ApiCreatedResponse({ type: CreateOAuthUrlDto })
  @ApiPipeException()
  async createOAuthUrl(@Body() command: CreateOAuthUrlCommand) {
    return this.oauthService.createOAuthUrl(command);
  }

  /** @todo after jwt auth guard */
  @Post('connect')
  @ApiOperation({ summary: 'OAuth 계정 추가 연동' })
  @ApiCreatedResponse()
  async connecOtherOAuth() {
    return;
  }

  @Get('google')
  @UseFilters(OAuthErrorFilter)
  @ApiExcludeEndpoint()
  async signFromGoogle(@Res({ passthrough: true }) res: Response, @Query() command: SignFromGoogleCommand) {
    return this.oauthService.signFromGoogle(res, command);
  }

  @Get('kakao')
  @UseFilters(OAuthErrorFilter)
  @ApiExcludeEndpoint()
  async signFromKakao(@Res({ passthrough: true }) res: Response, @Query() command: SignFromKakaoCommand) {
    return this.oauthService.signFromKakao(res, command);
  }

  @Get('naver')
  @UseFilters(OAuthErrorFilter)
  @ApiExcludeEndpoint()
  async signFromNaver(@Res({ passthrough: true }) res: Response, @Query() command: SignFromNaverCommand) {
    return this.oauthService.signFromNaver(res, command);
  }
}
