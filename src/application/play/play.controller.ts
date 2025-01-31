import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RequiredJwtGuard, RequiredPlayerGuard } from 'src/persistent/decorators';

import { KeepCardDTO } from './dto/keep-card.dto';
import { PurchaseCardDTO } from './dto/purchase-card.dto';
import { TakeTokenDTO } from './dto/take-token.dto';
import { PlayService } from './play.service';

@RequiredJwtGuard()
@RequiredPlayerGuard()
@Controller('play')
export class PlayController {
  constructor(private readonly playService: PlayService) {}

  @Get()
  @ApiOperation({ summary: '참여중인 게임 상세 정보 불러오기' })
  async getDetail() {
    return this.playService.getDetail();
  }

  @Post('token')
  @ApiOperation({ summary: '토큰 가져오기' })
  async takeToken(@Body() body: TakeTokenDTO) {
    return this.playService.takeToken(body);
  }

  @Post('keep/development-card')
  @ApiOperation({ summary: '개발 카드 찜하기' })
  async keepCard(@Body() body: KeepCardDTO) {
    return this.playService.keepCard(body);
  }

  @Post('purchase/development-card')
  @ApiOperation({ summary: '개발 카드 구매하기' })
  async purchaseDevelopmentCard(@Body() body: PurchaseCardDTO) {
    return this.playService.purchaseDevelopmentCard(body);
  }

  @Post('purchase/noble-card')
  @ApiOperation({ summary: '귀족 카드 구매하기' })
  async purchaseNobleCard(@Body() body: PurchaseCardDTO) {
    return this.playService.purchaseNobleCard(body);
  }
}
