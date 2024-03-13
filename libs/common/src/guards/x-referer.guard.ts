import { ENSEMBLE_CONFIG, EnsembleConfigReturnType } from '@libs/configs';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class XRefererGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.configService.get<EnsembleConfigReturnType>(ENSEMBLE_CONFIG);
    const req = context.switchToHttp().getRequest<Request>();
    const xReferer = req.headers['x-referer'];

    if (typeof xReferer === 'string' && Object.values(config.servers).includes(xReferer)) {
      return true;
    }

    throw new ForbiddenException();
  }
}
