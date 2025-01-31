import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './application/auth/guard/jwt-auth.guard';
import { PlayerAuthGuard } from './application/auth/guard/player-auth.guard';
import { ContextInterceptor } from './core/context/context.interceptor';
import { LoggingInterceptor } from './core/logging/logging.interceptor';
import { RequestHeader } from './persistent/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDocument = new DocumentBuilder()
    .setTitle('Splendor API')
    .setVersion(process.env.npm_package_version ?? '')
    .addBearerAuth(
      {
        name: RequestHeader.Authorization,
        type: 'http',
        in: 'header',
        bearerFormat: 'bearer',
      },
      RequestHeader.Authorization,
    )
    .addApiKey(
      {
        name: RequestHeader.XRefreshToken,
        type: 'apiKey',
        in: 'header',
      },
      RequestHeader.XRefreshToken,
    )
    .build();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerDocument));

  const configService = app.get(ConfigService);

  app.enableCors({ origin: new RegExp(configService.getOrThrow('CORS_ORIGIN')) });
  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(PlayerAuthGuard));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    }),
    app.get(ContextInterceptor),
    app.get(LoggingInterceptor),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const error = errors.shift();
        const message = Object.values(error?.constraints ?? {}).shift();

        return new BadRequestException(message);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
