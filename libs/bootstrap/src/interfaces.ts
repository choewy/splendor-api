import { LogLevel, LoggerService } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';

export interface CreateBootstrapOptions {
  logger?: false | LoggerService | LogLevel[];
  swagger?: DocumentBuilder;
}
