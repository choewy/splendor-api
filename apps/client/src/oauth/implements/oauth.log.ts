import { OAuthPlatform } from '@libs/entity';
import { HttpException } from '@nestjs/common';

import { OAuthStateDto } from '../dtos';

export class OAuthLog {
  context: string;
  handler: string;
  platform: OAuthPlatform;
  state: OAuthStateDto;
  message = '';
  error?: object;

  constructor(platform: OAuthPlatform, state: OAuthStateDto, context: string, handler: string) {
    this.context = context;
    this.handler = [context, handler].join('.');
    this.platform = platform;
    this.state = state;
  }

  toSuccess() {
    this.message = 'successed';

    return this;
  }

  toError(e: Error | HttpException) {
    this.message = 'failed';
    this.error = { name: e.name, message: e.message, cause: e.cause };

    return this;
  }
}
