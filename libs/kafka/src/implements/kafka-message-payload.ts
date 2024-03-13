import { EachMessagePayload, IHeaders } from 'kafkajs';

import { KafkaMessage } from './kafka-message';

export class KafkaMessagePayload<Message = KafkaMessage> {
  readonly topic: string;
  readonly partition: number;
  readonly message: Message;
  readonly timestamp: Date;
  readonly attributes: number;
  readonly offset: number;
  readonly size?: number;
  readonly headers?: IHeaders;

  constructor(payload: EachMessagePayload) {
    let value: object;

    try {
      value = JSON.parse(Buffer.from(payload.message.value).toString('utf-8'));
    } catch {
      value = { plainText: payload.message.value };
    }

    let key: string | undefined;

    if (payload.message.key) {
      key = Buffer.from(payload.message.key).toString('utf-8');
    }

    this.topic = payload.topic;
    this.partition = payload.partition;
    this.message = new KafkaMessage(value, key) as Message;
    this.timestamp = new Date(+payload.message.timestamp);
    this.attributes = payload.message.attributes;
    this.offset = +payload.message.offset;
    this.size = payload.message.size;
    this.headers = payload.message.headers;
  }
}
