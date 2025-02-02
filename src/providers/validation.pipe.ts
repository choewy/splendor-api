import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const validationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableCircularCheck: true, enableImplicitConversion: true },
  stopAtFirstError: true,
  exceptionFactory(errors) {
    const error = errors.shift();
    const message = Object.values(error?.constraints ?? {}).shift();

    return new BadRequestException(message);
  },
});

export const classSerializerInterceptor = (reflector: Reflector) => new ClassSerializerInterceptor(reflector, { enableCircularCheck: true, enableImplicitConversion: true });
