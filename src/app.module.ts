import { AuthModule } from '@domains/auth';
import { StudioModule } from '@domains/studio';
import { UserModule } from '@domains/user';
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
        return typeOrmConfigService.getTypeOrmOptions();
      },
    }),
    HealthExModule,
    UserModule,
    AuthModule,
    StudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
