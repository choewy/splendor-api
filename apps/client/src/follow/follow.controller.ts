import { IgnoreJwtError, JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { FollowService } from './follow.service';
import { GetFollowByUserQuery, GetFollowsQuery } from './queries';

@ApiController('follow', '팔로우')
@UseGuards(JwtGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('followings')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 팔로잉 목록 조회' })
  @ApiOkResponse()
  async getFollowings(@ReqJwtUser() userId: number | null, @Query() query: GetFollowsQuery) {
    return this.followService.getFollowings(userId, userId, query);
  }

  @Get('followers')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 팔로워 목록 조회' })
  @ApiOkResponse()
  async getFollowers(@ReqJwtUser() userId: number, @Query() query: GetFollowsQuery) {
    return this.followService.getFollowers(userId, userId, query);
  }

  @Get('followings/:userId(\\d+)')
  @IgnoreJwtError()
  @ApiBearerAuth()
  @ApiOperation({ summary: '다른 회원 팔로잉 목록 조회' })
  @ApiOkResponse()
  async getOtherFollowings(@ReqJwtUser() userId: number | null, @Param() param: GetFollowByUserQuery, @Query() query: GetFollowsQuery) {
    return this.followService.getFollowings(userId, param.userId, query);
  }

  @Get('followers/:userId(\\d+)')
  @IgnoreJwtError()
  @ApiBearerAuth()
  @ApiOperation({ summary: '다른 회원 팔로워 목록 조회' })
  @ApiOkResponse()
  async getOtherFollowers(@ReqJwtUser() userId: number | null, @Param() param: GetFollowByUserQuery, @Query() query: GetFollowsQuery) {
    return this.followService.getFollowers(userId, param.userId, query);
  }
}
