import { BadRequestException } from '@nestjs/common';

export class OAuthStateDto {
  static decode(base64: string) {
    try {
      const state = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
      return new OAuthStateDto(state.redirectUrl, state.userId);
    } catch (e) {
      throw new BadRequestException('invalid state');
    }
  }

  constructor(readonly redirectUrl: string, readonly userId?: number) {}

  encode() {
    return Buffer.from(JSON.stringify({ redirectUrl: this.redirectUrl, userId: this.userId }), 'utf-8').toString('base64');
  }
}
