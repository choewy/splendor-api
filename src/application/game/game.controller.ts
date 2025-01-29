import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiPrivate } from 'src/persistent/decorators';

import { CreateGameDTO } from './dto/create-game.dto';
import { GameListDTO } from './dto/game-list.dto';
import { GetGameListQueryParamDTO } from './dto/get-game-list-query-param.dto';
import { GameService } from './game.service';

@ApiPrivate()
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @ApiOperation({ summary: '게임 목록 조회' })
  @ApiOkResponse({ type: GameListDTO })
  async list(@Query() queryParam: GetGameListQueryParamDTO) {
    return this.gameService.list(queryParam);
  }

  @Post()
  @ApiOperation({ summary: '게임 생성' })
  async create(@Body() body: CreateGameDTO) {
    return this.gameService.create(body);
  }

  @Patch('ready')
  @ApiOperation({ summary: '준비 상태로 변경' })
  async ready() {
    return this.gameService.ready();
  }

  @Patch('wating')
  @ApiOperation({ summary: '대기 상태로 변경' })
  async wating() {
    return this.gameService.wating();
  }

  @Put('join/:gameId')
  @ApiOperation({ summary: '게임 대기실 참여' })
  async join(@Param('gameId') gameId: string) {
    return this.gameService.join(gameId);
  }

  @Put('leave')
  @ApiOperation({ summary: '게임 대기실 떠나기' })
  async leave() {
    return this.gameService.leave();
  }

  @Patch('start')
  @ApiOperation({ summary: '게임 시작(방장만 가능)' })
  async start() {
    return this.gameService.start();
  }
}
