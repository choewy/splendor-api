import { TokenConstructorArgs } from './types';

export class Token {
  public ruby: number;
  public sapphire: number;
  public emerald: number;
  public diamond: number;
  public onyx: number;
  public gold: number;

  constructor(args: TokenConstructorArgs) {
    this.ruby = args.ruby ?? 0;
    this.sapphire = args.sapphire ?? 0;
    this.emerald = args.emerald ?? 0;
    this.diamond = args.diamond ?? 0;
    this.onyx = args.onyx ?? 0;
    this.gold = args.gold ?? 0;
  }
}

export class CardToken {
  public ruby: number;
  public sapphire: number;
  public emerald: number;
  public diamond: number;
  public onyx: number;

  constructor(args: TokenConstructorArgs) {
    this.ruby = args.ruby ?? 0;
    this.emerald = args.emerald ?? 0;
    this.sapphire = args.sapphire ?? 0;
    this.diamond = args.diamond ?? 0;
    this.onyx = args.onyx ?? 0;
  }
}

export class NobleCard {
  constructor(
    public id: number,
    public point: number,
    public cost: CardToken,
  ) {}
}

export class DevelopmentCard {
  constructor(
    public id: number,
    public level: number,
    public point: number,
    public cost: CardToken,
    public bonus: CardToken,
  ) {}
}
