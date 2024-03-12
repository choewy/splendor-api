export class KafkaMessageEvent {
  readonly name = 'kafka.';

  constructor(topic: string) {
    this.name += topic;
  }
}
