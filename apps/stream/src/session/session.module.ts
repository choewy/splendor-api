import { AlertWidgetRepository, StudioPlaySettingRepository, StudioRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import {
  DonationSessionManager,
  SocketSessionManager,
  StudioPlaySessionManager,
  StudioSettingSessionManager,
  WidgetSessionManager,
} from './managers';
import { SessionService } from './session.service';

@Module({})
export class SessionModule {
  static forRoot(): DynamicModule {
    const managers = [
      SessionService,
      SocketSessionManager,
      StudioPlaySessionManager,
      StudioSettingSessionManager,
      DonationSessionManager,
      WidgetSessionManager,
    ];

    return {
      global: true,
      module: SessionModule,
      imports: [TypeOrmLibsModule.forFeature([StudioRepository, StudioPlaySettingRepository, AlertWidgetRepository])],
      providers: managers,
      exports: managers,
    };
  }
}
