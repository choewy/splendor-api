import { ApiController, ApiPipeException } from '@libs/swagger';
import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { CreateOAuthUrlDto } from './dtos';
import { GetOAuthAuthorizeUrlDto } from './queries';
import { OAuthService } from './services';

@ApiController('oauth', 'OAuth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post()
  @ApiOperation({ summary: 'OAuth 인증 URL 가져오기' })
  @ApiOkResponse({ type: CreateOAuthUrlDto })
  @ApiPipeException()
  async getOAuthAuthorizeUrl(@Body() query: GetOAuthAuthorizeUrlDto) {
    return this.oauthService.getOAuthAuthorizeUrl(query.platform);
  }
}
