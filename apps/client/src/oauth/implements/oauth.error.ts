import { OAuthPlatform } from '@libs/entity';
import { AxiosError } from 'axios';

export class OAuthGetTokenError extends Error {
  constructor(platform: OAuthPlatform, e: AxiosError | Error) {
    super();

    this.name = e.name;
    this.message = `${platform.charAt(0).toUpperCase()}${platform.slice(1)}${OAuthGetTokenError.name}`;

    if (e instanceof AxiosError) {
      this.cause = e.response?.data;
    } else {
      this.cause = { name: e.name, message: e.message };
    }
  }
}

export class OAuthGetProfileError extends Error {
  constructor(platform: OAuthPlatform, e: AxiosError | Error) {
    super();

    this.name = e.name;
    this.message = `${platform.charAt(0).toUpperCase()}${platform.slice(1)}${OAuthGetProfileError.name}`;

    if (e instanceof AxiosError) {
      this.cause = e.response?.data;
    } else {
      this.cause = { name: e.name, message: e.message };
    }
  }
}
