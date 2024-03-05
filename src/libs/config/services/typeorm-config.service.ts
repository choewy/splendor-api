import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LogLevel } from 'typeorm';

import { AbstractConfigService } from '../abstracts';

export class TypeOrmConfigService extends AbstractConfigService {
  private readonly TYPEORM_TYPE = this.configService.get('TYPEORM_TYPE');
  private readonly TYPEORM_HOST = this.configService.get<string>('TYPEORM_HOST');
  private readonly TYPEORM_PORT = +this.configService.get<number>('TYPEORM_PORT');
  private readonly TYPEORM_USERNAME = this.configService.get<string>('TYPEORM_USERNAME');
  private readonly TYPEORM_PASSWORD = this.configService.get<string>('TYPEORM_PASSWORD');
  private readonly TYPEORM_DATABASE = this.configService.get<string>('TYPEORM_DATABASE');
  private readonly TYPEORM_LOGGING: LogLevel[] = ['error', 'warn'];
  private readonly TYPEORM_SHYNCHRONIZE = false;
  private readonly TYPEORM_AUTOLOAD_ENTITIES = true;
  private readonly TYPEORM_ENTITIES = [
    this.configService.get<string>('PWD') + '/dist/**/*.entity.js',
    this.configService.get<string>('PWD') + '/src/**/*.entity.ts',
  ];

  getTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.TYPEORM_TYPE,
      host: this.TYPEORM_HOST,
      port: this.TYPEORM_PORT,
      username: this.TYPEORM_USERNAME,
      password: this.TYPEORM_PASSWORD,
      database: this.TYPEORM_DATABASE,
      logging: this.TYPEORM_LOGGING,
      entities: this.TYPEORM_ENTITIES,
      autoLoadEntities: this.TYPEORM_AUTOLOAD_ENTITIES,
      synchronize: this.TYPEORM_SHYNCHRONIZE,
    };
  }
}
