import { TokenConstructorArgs } from './types';

export class Token {
  public red: number = 0;
  public green: number = 0;
  public blue: number = 0;
  public white: number = 0;
  public black: number = 0;
  public yellow: number = 0;

  constructor(args: TokenConstructorArgs) {
    this.red = args.red ?? 0;
    this.green = args.green ?? 0;
    this.blue = args.blue ?? 0;
    this.white = args.white ?? 0;
    this.black = args.black ?? 0;
    this.yellow = args.yellow ?? 0;
  }
}

export class CardToken {
  public red: number = 0;
  public green: number = 0;
  public blue: number = 0;
  public white: number = 0;
  public black: number = 0;

  constructor(args: TokenConstructorArgs) {
    this.red = args.red ?? 0;
    this.green = args.green ?? 0;
    this.blue = args.blue ?? 0;
    this.white = args.white ?? 0;
    this.black = args.black ?? 0;
  }
}

export class NobleCard {
  constructor(
    public id: number,
    public name: string,
    public point: number,
    public cost: CardToken,
  ) {}
}

export class DevelopmentCard {
  constructor(
    public id: number,
    public name: string,
    public level: number,
    public point: number,
    public cost: CardToken,
    public bonus: CardToken,
  ) {}
}

export class Player {
  constructor(
    public id: number,
    public name: string,
    public point: number,
    public nobleCards: NobleCard[],
    public developmentCards: DevelopmentCard[],
    public dibsCards: DevelopmentCard[],
    public bonusToken: CardToken,
    public walletToken: Token,
  ) {}
}

export class PlayGround {
  constructor(
    public id: number,
    public name: string,
    public players: Map<Pick<Player, 'id'>['id'], Player>,
    public token: Token,
    public nobleCards: NobleCard[],
    public developmentCardsOfLevel1: DevelopmentCard[],
    public developmentCardsOfLevel2: DevelopmentCard[],
    public developmentCardsOfLevel3: DevelopmentCard[],
  ) {}

  public joinPlayer(player: Player) {
    this.players.set(player.id, player);

    return this;
  }

  public leavePlayer(player: Player) {
    this.players.delete(player.id);

    return this;
  }

  public initialize() {
    switch (Array.from(this.players.keys()).length) {
      case 2:
        break;

      case 3:
        break;

      case 4:
        break;
    }
  }
}
