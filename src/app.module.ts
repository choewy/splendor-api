import { ConfigExModule, TypeOrmConfigService } from '@libs/config';
import { HealthExModule } from '@libs/health';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigExModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigExModule.forFeature([TypeOrmConfigService])],
      inject: [TypeOrmConfigService],
      useFactory(typeOrmConfigService: TypeOrmConfigService) {
        return typeOrmConfigService.changeValue('TYPEORM_SHYNCHRONIZE', true).getTypeOrmOptions();
      },
    }),
    HealthExModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
