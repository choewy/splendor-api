import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequiredJwtGuard } from 'src/persistent/decorators';

import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@RequiredJwtGuard()
@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: '인가' })
  @ApiOkResponse({ type: AuthDTO })
  async auth() {
    return this.authService.getAuth();
  }
}
