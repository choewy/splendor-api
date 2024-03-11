import { createBootstrapOptions } from '@libs/bootstrap';
import { APP_CONFIG, AppConfigReturnType, NodeEnv, SYSTEM_CONFIG, SystemConfigReturnType } from '@libs/configs';
import { JwtLibsService } from '@libs/jwt';
import { WinstonLogger } from '@libs/logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = WinstonLogger.create('client');
  const app = await NestFactory.create(AppModule, { logger });

  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfigReturnType>(APP_CONFIG);
  const systemConfig = config.get<SystemConfigReturnType>(SYSTEM_CONFIG);

  if (systemConfig.env === NodeEnv.Local) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Ensemble Client APIs')
      .setVersion(appConfig.version)
      .addBearerAuth(undefined, 'bearer')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    const swaggerOptions: SwaggerUiOptions = {};

    if (appConfig.swaggerUserId) {
      const jwtLibsService = app.get(JwtLibsService);
      const value = jwtLibsService.createTokens(appConfig.swaggerUserId).access;

      swaggerOptions.authAction = {
        bearer: { schema: { type: 'http' }, value },
      };
    }

    SwaggerModule.setup('/swagger', app, swaggerDocument, { swaggerOptions });
  }

  const bootstrapOptions = createBootstrapOptions(app);

  app.enableCors(appConfig.corsOptions);
  app.useGlobalPipes(...bootstrapOptions.pipes);
  app.useGlobalFilters(...bootstrapOptions.filters);
  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.enableShutdownHooks();

  await app.listen(appConfig.port);
}

bootstrap();
