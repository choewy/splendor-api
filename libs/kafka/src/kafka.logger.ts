import { Logger } from '@nestjs/common';
import { LogEntry, logLevel } from 'kafkajs';

const levels = ['log', 'error', 'warn', 'log', 'debug'];

export const KafkaLoggerCreator = (level: logLevel) => {
  let i = level;

  if (i > 3) {
    i--;
  }

  return ({ namespace, label, log }: LogEntry) => {
    Logger[levels[i]]({ context: `Kafka${namespace}`, label, ...log });
  };
};
