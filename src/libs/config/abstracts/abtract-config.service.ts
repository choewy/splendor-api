import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export abstract class AbstractConfigService implements OnModuleInit {
  protected readonly configService = new ConfigService();

  onModuleInit() {
    this.printValues();
  }

  changeValue(key: string, value: unknown) {
    Object.assign(this, { [key]: value });

    return this;
  }

  printValues() {
    const className = this.constructor.name;
    const values: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(this)) {
      if (key === 'configService') {
        continue;
      }

      values[key] = value;
    }

    Logger.log(`[${className}] ${JSON.stringify(values, null, 2)}`);
  }

  printMethods() {
    const className = this.constructor.name;
    const childrenPrototype = Object.getPrototypeOf(this);
    const childrenMethodNames = Object.getOwnPropertyNames(childrenPrototype);
    const values: Record<string, object | string | number | boolean> = {};

    for (const methodName of childrenMethodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      values[methodName] = this[methodName]();
    }

    Logger.log(`[${className}] ${JSON.stringify(values, null, 2)}`);
  }
}
