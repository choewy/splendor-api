import { AlertWidgetRepository, StudioPlaySettingRepository, StudioRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { SessionService } from './session.service';

@Module({})
export class SessionModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: SessionModule,
      imports: [TypeOrmLibsModule.forFeature([StudioRepository, StudioPlaySettingRepository, AlertWidgetRepository])],
      providers: [SessionService],
      exports: [SessionService],
    };
  }
}
