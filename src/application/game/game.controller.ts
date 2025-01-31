import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RequiredEmptyPlayerGuard, RequiredJwtGuard, RequiredPlayerGuard } from 'src/persistent/decorators';

import { ChangePlayerReadyStatus } from './dto/change-player-ready-status.dto';
import { CreateGameDTO } from './dto/create-game.dto';
import { GameListDTO } from './dto/game-list.dto';
import { GetGameListQueryParamDTO } from './dto/get-game-list-query-param.dto';
import { JoinGameDTO } from './dto/join-game.dto';
import { GameService } from './game.service';

@RequiredJwtGuard()
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
  @RequiredEmptyPlayerGuard()
  @ApiOperation({ summary: '게임 생성' })
  async create(@Body() body: CreateGameDTO) {
    return this.gameService.create(body);
  }

  @Patch('change-ready-status')
  @RequiredPlayerGuard()
  @ApiOperation({ summary: '준비 상태 변경' })
  async changeReadyStatus(@Body() body: ChangePlayerReadyStatus) {
    return this.gameService.changeReadyStatus(body);
  }

  @Put('join')
  @RequiredEmptyPlayerGuard()
  @ApiOperation({ summary: '게임 대기실 참여' })
  async join(@Body() body: JoinGameDTO) {
    return this.gameService.join(body);
  }

  @Put('leave')
  @RequiredPlayerGuard()
  @ApiOperation({ summary: '게임 대기실 떠나기' })
  async leave() {
    return this.gameService.leave();
  }

  @Patch('start')
  @RequiredPlayerGuard()
  @ApiOperation({ summary: '게임 시작(방장만 가능)' })
  async startGame() {
    return this.gameService.startGame();
  }
}
