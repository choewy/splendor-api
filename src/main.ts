import { SwaggerExModule } from '@libs/swagger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerExModule.setup(app);

  await app.listen(4000);
}

bootstrap();
