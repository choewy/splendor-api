import { FileFilter } from '@libs/bootstrap';
import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController, ApiFile } from '@libs/swagger';
import { Body, Get, Patch, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UpdateProfileCommand } from './commands';
import { ProfileDto } from './dtos';
import { ProfileService } from './profile.service';

@ApiController('profile', '프로필')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiOkResponse({ type: ProfileDto })
  async getProfile(@ReqJwtUser() userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  @ApiOkResponse({ type: ProfileDto })
  async updateProfile(@ReqJwtUser() userId: number, @Body() command: UpdateProfileCommand) {
    return this.profileService.updateProfile(userId, command);
  }

  @Patch('image')
  @ApiFile('image', { localOptions: { fileFilter: FileFilter.Image } })
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 이미지 업로드' })
  async uploadProfileImage(@ReqJwtUser() userId: number, @UploadedFile() image: Express.Multer.File) {
    return;
  }
}
