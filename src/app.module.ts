import { ConfigExModule } from '@libs/config';
import { HealthExModule } from '@libs/health';
import { PassportExModule } from '@libs/passport';
import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domains';

@Module({
  imports: [ConfigExModule.forRoot(), TypeOrmExModule.forRoot(), PassportExModule.forRoot(), HealthExModule, DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
