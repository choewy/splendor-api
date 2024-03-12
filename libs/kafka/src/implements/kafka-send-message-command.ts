import { ProducerRecord } from 'kafkajs';

import { KafkaMessage } from './kafka-message';

export enum KafkaMessageAck {
  FastAndHighLoss = 0,
  Normal = 1,
  All = -1,
}

export class KafkaSendMessageCommand {
  constructor(readonly topic: string, readonly messages: KafkaMessage[], readonly acks = KafkaMessageAck.All) {}

  transform(): ProducerRecord {
    return {
      topic: this.topic,
      messages: this.messages.map((message) => message.transform()),
      acks: this.acks,
    };
  }
}
