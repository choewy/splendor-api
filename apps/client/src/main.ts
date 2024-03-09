import { createBootstrapOptions } from '@libs/bootstrap';
import { WinstonLogger } from '@libs/logger';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = WinstonLogger.create('client');
  const app = await NestFactory.create(AppModule, { logger });

  const builder = new DocumentBuilder().setTitle('Ensemble Client APIs').addBearerAuth();
  const document = SwaggerModule.createDocument(app, builder.build());

  SwaggerModule.setup('/swagger', app, document);

  const options = createBootstrapOptions(app);

  app.useGlobalPipes(...options.pipes);
  app.useGlobalFilters(...options.filters);
  app.useGlobalInterceptors(...options.interceptors);

  await app.listen(4000);
}

bootstrap();
