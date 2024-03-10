import { Request } from 'express';

import { ValidationFailException } from '../exceptions';

export const IMAGE_FILES_REGEXP = new RegExp(/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg)$/);

export class FileFilter {
  static Image(_: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    if (IMAGE_FILES_REGEXP.exec(file.originalname)) {
      return callback(null, true);
    }

    callback(new ValidationFailException(`${file.fieldname} must be an image file`, { cause: { target: file.originalname } }), false);
  }
}
