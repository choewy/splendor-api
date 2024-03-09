import { TYPEORM_MYSQL_CONFIG, TypeOrmMySQLConfig } from '@libs/configs';
import * as entities from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmMySQLConfig],
    }),
    TypeOrmLibsModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        console.log(configService.get(TYPEORM_MYSQL_CONFIG));
        return Object.assign(configService.get(TYPEORM_MYSQL_CONFIG), {
          entities: Object.values(entities),
        });
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
