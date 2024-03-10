import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export type ApiFileOptions = { interceptor?: typeof FileInterceptor; localOptions?: MulterOptions };
export type ApiFilesOptions = { interceptor?: typeof FilesInterceptor; maxCount?: number; localOptions?: MulterOptions };

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

export const ApiFiles = (fieldname: string, options: ApiFilesOptions = {}) => {
  if (options.interceptor == null) {
    options.interceptor = FilesInterceptor;
  }

  return applyDecorators(
    UseInterceptors(options.interceptor(fieldname, options.maxCount, options.localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      isArray: true,
      schema: { type: 'object', properties: { [fieldname]: { type: 'array', items: { type: 'string', format: 'binary' } } } },
    }),
  );
};
