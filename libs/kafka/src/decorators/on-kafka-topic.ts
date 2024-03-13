import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { KafkaMessageEvent } from '../implements';

export const OnKafkaTopic = (topic: string) => {
  const event = new KafkaMessageEvent(topic);

  return applyDecorators(OnEvent(event.name), (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const handler = descriptor.value;
    const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metadataValues = metadataKeys.map((key) => {
      return [key, Reflect.getMetadata(key, descriptor.value)];
    });

    descriptor.value = async function (...args: any[]) {
      const context = [this.constructor?.name, handler.name].join('.');

      try {
        await handler.bind(this)(...args);
        return { context };
      } catch (error) {
        return { context, error };
      }
    };

    metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
  });
};
