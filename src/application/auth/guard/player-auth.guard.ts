import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ContextService } from 'src/core/context/context.service';
import { MetadataKey } from 'src/persistent/enums';

import { AuthService } from '../auth.service';

@Injectable()
export class PlayerAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.contextService.executionContext = context;

    const requiredAuth = this.reflector.getAllAndOverride(MetadataKey.RequiredJwtAuthGuard, [context.getClass(), context.getHandler()]);
    const requiredPlayerAuth = this.reflector.getAllAndOverride(MetadataKey.RequiredPlayerAuthGuard, [context.getClass(), context.getHandler()]);
    const requiredEmptyPlayerAuth = this.reflector.getAllAndOverride(MetadataKey.RequiredEmptyPlayerAuthGuard, [context.getClass(), context.getHandler()]);

    if (!requiredAuth) {
      return true;
    }

    const oauth = this.contextService.requestUser;

    if (!oauth) {
      throw new ForbiddenException();
    }

    if (!requiredPlayerAuth && !requiredEmptyPlayerAuth) {
      return true;
    }

    const player = await this.authService.getPlayer(oauth);

    if (!player && requiredPlayerAuth) {
      throw new ForbiddenException();
    }

    this.contextService.requestPlayer = player;

    return true;
  }
}
