import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { RequestHeader } from './persistent/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDocument = new DocumentBuilder()
    .setTitle('Splendor API')
    .setVersion(process.env.npm_package_version ?? '')
    .addBearerAuth({
      name: RequestHeader.Authorization,
      type: 'http',
      in: 'header',
      bearerFormat: 'bearer',
    })
    .addApiKey({
      name: RequestHeader.XRefreshToken,
      type: 'apiKey',
      in: 'header',
    })
    .build();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerDocument));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
