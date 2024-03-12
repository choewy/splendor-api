import { Message } from 'kafkajs';

export class KafkaMessage {
  constructor(readonly key: string, readonly value: string | object) {}

  transform(): Message {
    return { key: this.key, value: JSON.stringify(this.value) };
  }
}
