import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class TestingFixture {
  static of<T>(Cls: Type<T>, values: Partial<T> = {}): T {
    return plainToInstance(Cls, values, {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    });
  }
}
