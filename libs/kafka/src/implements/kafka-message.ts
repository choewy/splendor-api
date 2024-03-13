import { Message } from 'kafkajs';

export class KafkaMessage {
  constructor(readonly value: string | object, readonly key?: string) {}

  transform(): Message {
    return { key: this.key, value: JSON.stringify(this.value) };
  }
}
