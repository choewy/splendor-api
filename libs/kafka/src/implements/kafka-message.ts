import { Message } from 'kafkajs';

export class KafkaMessage<Value = string | object> {
  constructor(readonly value: Value, readonly key?: string) {}

  transform(): Message {
    return { key: this.key, value: JSON.stringify(this.value) };
  }
}
