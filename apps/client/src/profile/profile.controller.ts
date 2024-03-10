import { FileFilter } from '@libs/bootstrap';
import { ApiController, ApiFile } from '@libs/swagger';
import { Body, Get, Patch, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UpdateProfileCommand } from './commands';
import { ProfileService } from './profile.service';
import { ClientContext, ClientJwtGuard, ReqClient } from '../jwt';

@ApiController('profile', '프로필')
@UseGuards(ClientJwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  async getProfile(@ReqClient() client: ClientContext) {
    return;
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  async updateProfile(@ReqClient() client: ClientContext, @Body() command: UpdateProfileCommand) {
    return;
  }

  @Patch('image')
  @ApiFile('image', { localOptions: { fileFilter: FileFilter.Image } })
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 이미지 업로드' })
  async uploadProfileImage(@ReqClient() client: ClientContext, @UploadedFile() image: Express.Multer.File) {
    return;
  }
}
