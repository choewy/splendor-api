import { CurrentUser, CurrentUserClaim } from '@common/decorators';
import { PassportJwtGuard } from '@libs/passport';
import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FollowParamDto, FollowerPaginationDto, FollowingPaginationDto, GetFollowsDto } from './dtos';
import { FollowService } from './services';

@ApiTags('팔로우')
@Controller('follow')
@UseGuards(PassportJwtGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('followings')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 계정 팔로잉(스튜디오들) 조회' })
  @ApiOkResponse({ type: FollowingPaginationDto })
  async getMyFollowings(@CurrentUser() user: CurrentUserClaim, @Query() query: GetFollowsDto) {
    return this.followService.getMyFollowings(user.id, query);
  }

  @Get('followers')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 스튜디오 팔로워(사용자들) 조회' })
  @ApiOkResponse({ type: FollowerPaginationDto })
  async getMyFollowers(@CurrentUser() user: CurrentUserClaim, @Query() query: GetFollowsDto) {
    return this.followService.getMyFollowers(user.id, query);
  }

  @Post(':toId(\\d+)')
  @ApiBearerAuth()
  @ApiOperation({ summary: '팔로우' })
  async follow(@CurrentUser() user: CurrentUserClaim, @Param() param: FollowParamDto) {
    console.log(param);
    return this.followService.follow(user.id, param.toId);
  }

  @Delete(':toId(\\d+)')
  @ApiBearerAuth()
  @ApiOperation({ summary: '언팔로우' })
  async unfollow(@CurrentUser() user: CurrentUserClaim, @Param() param: FollowParamDto) {
    return this.followService.unfollow(user.id, param.toId);
  }
}
