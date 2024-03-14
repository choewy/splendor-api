import { Type, applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export interface OnEventLibsReturnType<T> {
  context: string;
  value: T | null;
  error: Error | null;
}

export const OnLibsEvent = <T>(Event: Type<T>) => {
  return applyDecorators(OnEvent(Event.name), (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const handler = descriptor.value;
    const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metadataValues = metadataKeys.map((key) => {
      return [key, Reflect.getMetadata(key, descriptor.value)];
    });

    descriptor.value = async function (...args: any[]) {
      const context = [this.constructor?.name, handler.name].join('.');
      const returnValue: OnEventLibsReturnType<any> = {
        context,
        value: null,
        error: null,
      };

      try {
        returnValue.value = await handler.bind(this)(...args);
      } catch (error) {
        returnValue.error = error;
      }

      return returnValue;
    };

    metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
  });
};
