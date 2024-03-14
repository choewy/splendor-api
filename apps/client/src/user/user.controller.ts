import { ApiController } from '@libs/docs';
import { IgnoreJwtError, JwtGuard, ReqJwtUser } from '@libs/jwt';
import { Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { SearchUsersResultDto } from './dtos';
import { SearchUsersQuery } from './queries';
import { UserService } from './user.service';

@ApiController('users', '회원')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @IgnoreJwtError()
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 검색 조회' })
  @ApiOkResponse({ type: SearchUsersResultDto })
  async searchUsers(@ReqJwtUser() userId: number | null, @Query() query: SearchUsersQuery) {
    return this.userService.seaerchUsers(userId, query);
  }
}
