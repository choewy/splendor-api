import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { CreateTokensDto, RefreshTokensDto, TokensDto } from './dtos';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('tokens')
  @ApiOperation({ summary: '토큰 발급', description: '개발 용도로 활용' })
  @ApiCreatedResponse({ type: TokensDto })
  async createTokens(@Body() body: CreateTokensDto) {
    return this.authService.createTokens(body.id);
  }

  @Post('tokens/refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 갱신/재발급' })
  @ApiCreatedResponse({ type: TokensDto })
  async refreshTokens(@Req() req: Request, @Body() body: RefreshTokensDto) {
    return this.authService.refreshTokens(req, body.access, body.refresh);
  }
}
