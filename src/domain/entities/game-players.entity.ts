import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Game } from './game.entity';
import { Player } from './player.entity';

@Entity({ name: 'game_players', comment: '게임 참여 플레이어들' })
@Unique('game_players_unique', ['gameId', 'playerId'])
export class GamePlayers {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', comment: '방 PK' })
  gameId: string;

  @ManyToOne(() => Game, (e) => e.players, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: Game;

  @Column({ type: 'varchar', comment: '플레이어 PK' })
  playerId: string;

  @ManyToOne(() => Player, (e) => e.room, { onDelete: 'CASCADE' })
  @JoinColumn()
  player: Player;
}
