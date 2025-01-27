import { TokenConstructorArgs } from './types';

export class Token {
  public red: number;
  public green: number;
  public blue: number;
  public white: number;
  public black: number;
  public yellow: number;

  constructor(args: TokenConstructorArgs) {
    this.red = args.red ?? 0;
    this.green = args.green ?? 0;
    this.blue = args.blue ?? 0;
    this.white = args.white ?? 0;
    this.black = args.black ?? 0;
    this.yellow = args.yellow ?? 0;
  }

  // FIXME service 계층으로 이동
  public initialize(count: number) {
    this.red = count;
    this.green = count;
    this.blue = count;
    this.white = count;
    this.black = count;
    this.yellow = count;
  }
}

export class CardToken {
  public red: number;
  public green: number;
  public blue: number;
  public white: number;
  public black: number;

  constructor(args: TokenConstructorArgs) {
    this.red = args.red ?? 0;
    this.green = args.green ?? 0;
    this.blue = args.blue ?? 0;
    this.white = args.white ?? 0;
    this.black = args.black ?? 0;
  }

  // FIXME service 계층으로 이동
  public initialize(count: number) {
    this.red = count;
    this.green = count;
    this.blue = count;
    this.white = count;
    this.black = count;
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
  public point: number = 0;
  public nobleCards: NobleCard[] = [];
  public developmentCards: DevelopmentCard[] = [];
  public dibsCards: DevelopmentCard[] = [];
  public bonusToken: CardToken = new CardToken({});
  public walletToken: Token = new Token({});

  constructor(
    public id: number,
    public name: string,
  ) {}
}

export class Room {
  public waitSeconds: number = 60;
  public round: number = 0;
  public cursor: number = 0;
  public players: Player[] = [];
  public token = new Token({});
  public nobleCards: NobleCard[] = [];
  public developmentCardsOfLevel1OnDeck: DevelopmentCard[] = [];
  public developmentCardsOfLevel2OnDeck: DevelopmentCard[] = [];
  public developmentCardsOfLevel3OnDeck: DevelopmentCard[] = [];
  public developmentCardsOfLevel1OnField: DevelopmentCard[] = [];
  public developmentCardsOfLevel2OnField: DevelopmentCard[] = [];
  public developmentCardsOfLevel3OnField: DevelopmentCard[] = [];

  constructor(
    public id: number,
    public name: string,
  ) {}

  // FIXME service 계층으로 이동
  public nextPlayer() {
    this.cursor++;

    if (this.cursor === this.players.length - 1) {
      this.cursor = 0;
      this.round++;
    }

    return this;
  }

  // FIXME service 계층으로 이동
  public joinPlayer(player: Player) {
    if (!this.players.find(({ id }) => id === player.id)) {
      this.players.push(player);
    }

    return this;
  }

  // FIXME service 계층으로 이동
  public leavePlayer(player: Player) {
    this.players = this.players.filter(({ id }) => id !== player.id);

    return this;
  }

  // FIXME service 계층으로 이동
  public initialize(
    nobleCards: NobleCard[],
    developmentCardsOfLevel1: DevelopmentCard[],
    developmentCardsOfLevel2: DevelopmentCard[],
    developmentCardsOfLevel3: DevelopmentCard[],
  ) {
    const playerCount = this.players.length;

    switch (playerCount) {
      case 2:
        this.token.initialize(4);

        break;

      case 3:
        this.token.initialize(5);

        break;

      case 4:
        this.token.initialize(7);

        break;
    }

    this.token.yellow = 5;
    this.nobleCards = [...nobleCards].sort(() => Math.random() - 0.5).slice(0, playerCount + 1);
    this.developmentCardsOfLevel1OnDeck = [...developmentCardsOfLevel1].sort(() => Math.random() - 0.5);
    this.developmentCardsOfLevel2OnDeck = [...developmentCardsOfLevel2].sort(() => Math.random() - 0.5);
    this.developmentCardsOfLevel3OnDeck = [...developmentCardsOfLevel3].sort(() => Math.random() - 0.5);
    this.developmentCardsOfLevel1OnField = this.developmentCardsOfLevel1OnDeck.splice(0, 4);
    this.developmentCardsOfLevel2OnField = this.developmentCardsOfLevel2OnDeck.splice(0, 4);
    this.developmentCardsOfLevel3OnField = this.developmentCardsOfLevel3OnDeck.splice(0, 4);
    this.players.sort(() => Math.random() - 0.5);

    return this;
  }
}
