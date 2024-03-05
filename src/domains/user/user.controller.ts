import { PassportJwtGuard, PassportJwtPayload, ReqJwtPayload } from '@libs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserDto } from './dtos';
import { UserService } from './services';

@ApiTags('사용자')
@Controller('users')
@UseGuards(PassportJwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiOkResponse({ type: UserDto })
  async getMyProfile(@ReqJwtPayload() jwtPayload: PassportJwtPayload) {
    return this.userService.getMyProfile(jwtPayload);
  }
}
