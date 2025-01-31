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
