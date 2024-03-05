import { ConfigExModule, TypeOrmConfigService } from '@libs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class TypeOrmExModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigExModule.forFeature([TypeOrmConfigService])],
          inject: [TypeOrmConfigService],
          useFactory(typeOrmConfigService: TypeOrmConfigService) {
            return typeOrmConfigService.getTypeOrmOptions();
          },
        }),
      ],
      module: TypeOrmExModule,
    };
  }
}
