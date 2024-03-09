import { Type } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

export const INJECTABLE_REPOSITORY_METADATA_KEY = '__injectable_repository__';
export const InjectableRepository = <T extends ObjectLiteral>(Entity: Type<T>): ClassDecorator => {
  return (target) => Reflect.defineMetadata(INJECTABLE_REPOSITORY_METADATA_KEY, Entity, target);
};
