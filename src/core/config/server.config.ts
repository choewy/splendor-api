import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfig {
  constructor(private readonly configService: ConfigService) {}

  public getCorsOptions(): CorsOptions {
    return {
      origin: new RegExp(this.configService.getOrThrow('CORS_ORIGIN')),
    };
  }

  public getListenPort() {
    return +this.configService.getOrThrow('PORT');
  }
}
