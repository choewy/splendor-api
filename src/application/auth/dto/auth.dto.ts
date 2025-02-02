import { ApiResponseProperty } from '@nestjs/swagger';
import { OAuth } from 'src/domain/entities/oauth.entity';
import { Player } from 'src/domain/entities/player.entity';
import { OAuthPlatform } from 'src/domain/enums';

export class AuthDTO {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiResponseProperty({ type: String })
  nickname: string;

  @ApiResponseProperty({ type: String })
  imageUrl: string;

  gameId: string | null;
  playerId: string | null;

  constructor(oauth: OAuth, player: Player | null) {
    this.id = oauth.id;
    this.platform = oauth.platform;
    this.nickname = oauth.nickname ?? '';
    this.imageUrl = oauth.imageUrl ?? '';
    this.gameId = player?.gameId ?? null;
    this.playerId = player?.id ?? null;
  }
}
