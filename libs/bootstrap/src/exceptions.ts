import { BadRequestException } from '@nestjs/common';

export class ValidationFailException extends BadRequestException {}
