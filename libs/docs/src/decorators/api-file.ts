import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export type ApiFileOptions = { interceptor?: typeof FileInterceptor; localOptions?: MulterOptions };

export const ApiFile = (filename: string, options: ApiFileOptions = {}) => {
  if (options.interceptor == null) {
    options.interceptor = FileInterceptor;
  }

  return applyDecorators(
    UseInterceptors(options.interceptor(filename, options.localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({ schema: { type: 'object', properties: { [filename]: { type: 'string', format: 'binary' } } } }),
  );
};
