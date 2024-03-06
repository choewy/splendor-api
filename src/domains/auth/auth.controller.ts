import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { RefreshTokensDto, TokensDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 갱신/재발급' })
  @ApiCreatedResponse({ type: TokensDto })
  async refreshTokens(@Req() req: Request, @Body() body: RefreshTokensDto) {
    return this.authService.refreshTokens(req, body.access, body.refresh);
  }
}
