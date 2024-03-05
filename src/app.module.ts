import { AuthModule } from '@domains/auth';
import { StudioModule } from '@domains/studio';
import { UserModule } from '@domains/user';
import { ConfigExModule } from '@libs/config';
import { HealthExModule } from '@libs/health';
import { PassportExModule } from '@libs/passport';
import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigExModule.forRoot(),
    TypeOrmExModule.forRoot(),
    PassportExModule.forRoot(),
    HealthExModule,
    UserModule,
    AuthModule,
    StudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
