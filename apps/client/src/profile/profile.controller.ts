import { FileFilter } from '@libs/bootstrap';
import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController, ApiFile } from '@libs/swagger';
import { Body, Get, Patch, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UpdateProfileCommand } from './commands';
import { ProfileService } from './profile.service';

@ApiController('profile', '프로필')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  async getProfile(@ReqJwtUser() userId: number) {
    return;
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  async updateProfile(@ReqJwtUser() userId: number, @Body() command: UpdateProfileCommand) {
    return;
  }

  @Patch('image')
  @ApiFile('image', { localOptions: { fileFilter: FileFilter.Image } })
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 이미지 업로드' })
  async uploadProfileImage(@ReqJwtUser() userId: number, @UploadedFile() image: Express.Multer.File) {
    return;
  }
}
