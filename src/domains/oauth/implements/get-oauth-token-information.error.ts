import { OAuthPlatform } from '@entities/oauth.entity';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { isAxiosError } from '@nestjs/terminus/dist/utils';

export class GetOAuthTokenInformationError extends Error {
  constructor(platform: OAuthPlatform, e: Error | AxiosError) {
    super();

    this.cause = {
      platform,
      data: isAxiosError(e) ? e.response?.data : { name: e.name, message: e.message, stack: e.stack },
    };
  }
}
