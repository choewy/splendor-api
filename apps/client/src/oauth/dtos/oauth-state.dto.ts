import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class OAuthStateDto {
  static decode(base64: string) {
    try {
      return plainToInstance(OAuthStateDto, JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')));
    } catch (e) {
      throw new BadRequestException('invalid state');
    }
  }

  constructor(readonly successUrl: string, readonly failUrl: string, readonly userId?: number) {}

  encode() {
    return Buffer.from(
      JSON.stringify({
        successUrl: this.successUrl,
        failUrl: this.failUrl,
        userId: this.userId,
      }),
      'utf-8',
    ).toString('base64');
  }
}
