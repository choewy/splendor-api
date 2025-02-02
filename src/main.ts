import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './application/auth/guard/jwt-auth.guard';
import { PlayerAuthGuard } from './application/auth/guard/player-auth.guard';
import { RedisConfig } from './core/config/redis.config';
import { ServerConfig } from './core/config/server.config';
import { ContextInterceptor } from './core/context/context.interceptor';
import { LoggingInterceptor } from './core/logging/logging.interceptor';
import { RequestHeader } from './persistent/enums';
import { RedisIoAdapter } from './providers/redis-io.adapter';
import { classSerializerInterceptor, validationPipe } from './providers/validation.pipe';

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
  const redisConfig = new RedisConfig(configService);
  const serverConfig = new ServerConfig(configService);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(redisConfig.getRedisOptions());

  app.useWebSocketAdapter(redisIoAdapter);
  app.enableShutdownHooks();
  app.enableCors(serverConfig.getCorsOptions);
  app.use(cookieParser());
  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(PlayerAuthGuard));
  app.useGlobalInterceptors(classSerializerInterceptor(app.get(Reflector)), app.get(ContextInterceptor), app.get(LoggingInterceptor));
  app.useGlobalPipes(validationPipe);

  await app.listen(serverConfig.getListenPort());
}

bootstrap();
