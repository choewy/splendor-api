import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ApiController = (prefix?: string, ...tags: string[]) => applyDecorators(Controller(prefix), ApiTags(...tags));
