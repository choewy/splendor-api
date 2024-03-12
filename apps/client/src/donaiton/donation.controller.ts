import { JwtGuard, ReqJwtUser } from '@libs/jwt';
import { ApiController } from '@libs/swagger';
import { Body, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { CreateDonationCommand } from './commands';
import { DonationService } from './donation.service';

@ApiController('donations', '후원')
@UseGuards(JwtGuard)
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '후원' })
  @ApiCreatedResponse({ type: null })
  async createDonation(@ReqJwtUser() userId: number, @Body() command: CreateDonationCommand) {
    return this.donationService.createDonation(userId, command);
  }
}
