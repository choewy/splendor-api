import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { Game } from 'src/domain/entities/game.entity';
import { Player } from 'src/domain/entities/player.entity';

import { GameSocketData } from './class/game-socket-data';
import { GameGatewayPubEvent } from './enums';
import { GameRemoteSocket, GameSocket } from './types';

@WebSocketGateway({ namespace: 'game', transports: ['websocket'] })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly nsp: Namespace;

  async handleConnection(socket: GameSocket) {
    socket.data = new GameSocketData();
  }

  async created(game: Game) {
    this.nsp.emit(GameGatewayPubEvent.GameCreated, game);
  }

  async updated(game: Game) {
    this.nsp.emit(GameGatewayPubEvent.GameUpdated, game);
  }

  async removed(gameId: string) {
    this.nsp.emit(GameGatewayPubEvent.GameRemoved, { id: gameId });
  }

  async sync(game: Game) {
    this.nsp.to(game.id).emit(GameGatewayPubEvent.GameSync, game);
  }

  async join(player: Player, game: Game) {
    const sockets = Array.from(await this.nsp.fetchSockets()) as Array<GameRemoteSocket>;
    const socket = sockets.find((socket) => socket.data.userId === player.userId);

    if (!socket) {
      return;
    }

    this.nsp.socketsLeave(socket.id);
    socket.join(game.id);
  }

  async leave(player: Player, game: Game) {
    const sockets = Array.from(await this.nsp.fetchSockets()) as Array<GameRemoteSocket>;
    const socket = sockets.find((socket) => socket.data.userId === player.userId);

    if (!socket) {
      return;
    }

    socket.leave(game.id);
    this.nsp.socketsJoin(socket.id);
  }
}
