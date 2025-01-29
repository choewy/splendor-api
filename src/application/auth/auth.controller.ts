import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { IssueTokenDTO } from './dto/issue-token.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: 'JWT 발급', description: '자동 갱신' })
  async issueToken(@Body() body: IssueTokenDTO) {
    return this.authService.issueToken(body.id);
  }
}
