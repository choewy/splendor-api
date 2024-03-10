import { ApiController, ApiExtendsException, ApiPipeException } from '@libs/swagger';
import { Body, NotFoundException, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { CreateTokensCommand, RefreshTokensCommand } from './command';
import { ClientTokensDto } from './dto';
import { ClientJwtService } from '../jwt';

@ApiController('auth', '인증')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly clientJwtService: ClientJwtService) {}

  @Post('tokens')
  @ApiOperation({ summary: '인증 토큰 생성(개발용)' })
  @ApiCreatedResponse({ type: ClientTokensDto })
  @ApiPipeException(NotFoundException)
  async createTokensWithFindUser(@Body() command: CreateTokensCommand) {
    return this.authService.createTokensWithFindUser(command);
  }

  @Post('tokens/refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '인증 토큰 갱신' })
  @ApiCreatedResponse({ type: ClientTokensDto })
  @ApiExtendsException()
  async refreshTokens(@Req() req: Request, @Body() command: RefreshTokensCommand) {
    return this.clientJwtService.refreshTokens(req, command.refresh);
  }
}
