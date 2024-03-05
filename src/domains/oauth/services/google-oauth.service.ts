import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOAuthService {
  getAuthorizeUrl(): string {
    throw new Error('Method not implemented.');
  }
}
