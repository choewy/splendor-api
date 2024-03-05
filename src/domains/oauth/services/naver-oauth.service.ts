import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverOAuthService {
  getAuthorizeUrl(): string {
    throw new Error('Method not implemented.');
  }
}
